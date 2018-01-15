import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
import {setWxShareData} from './weixin_share'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 存储sessionStorage
 */
export const setSession = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSession = name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionStorage
 */
export const removeSession = name => {
    if (!name) return;
    window.sessionStorage.removeItem(name);
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') { 
        target = element.scrollTop;
    }else if(element.currentStyle){
        target = element.currentStyle[attr]; 
    }else{ 
        target = document.defaultView.getComputedStyle(element,null)[attr]; 
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
} 

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll',() => {
       showBackFun();
    }, false)
    document.addEventListener('touchstart',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchmove',() => {
       showBackFun();
    },{passive: true})

    document.addEventListener('touchend',() => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd();
            }else{
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
        if (document.body.scrollTop > 500) {
            callback(true);
        }else{
            callback(false);
        }
    }
}


/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    }else if(duration instanceof String){
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    const attrStyle = attr => {
        if (attr === "opacity") { 
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    const rootSize = parseFloat(document.documentElement.style.fontSize);

    const unit = {};
    const initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
        if (/[^\d^\.]+/gi.test(target[attr])) {
            unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
        }else{
            unit[attr] = 'px';
        }
        initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
        if (unit[attr] == 'rem') {
            target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
        }else{
            target[attr] = parseInt(target[attr]);
        }
    });


    let flag = true; //假设所有运动到达终点
    const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
        Object.keys(target).forEach(attr => {
            let iSpeed = 0;  //步长
            let status = false; //是否仍需运动
            let iCurrent = attrStyle(attr) || 0; //当前元素属性址
            let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
            let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
            switch(mode){
                case 'ease-out': 
                    speedBase = iCurrent;
                    intervalTime = duration*5/400;
                    break;
                case 'linear':
                    speedBase = initState[attr];
                    intervalTime = duration*20/400;
                    break;
                case 'ease-in':
                    let oldspeed = remberSpeed[attr] || 0;
                    iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
                    remberSpeed[attr] = iSpeed
                    break;
                default:
                    speedBase = iCurrent;
                    intervalTime = duration*5/400; 
            }
            if (mode !== 'ease-in') {
                iSpeed = (target[attr] - speedBase) / intervalTime;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            }
            //判断是否达步长之内的误差距离，如果到达说明到达目标点
            switch(mode){
                case 'ease-out': 
                    status = iCurrent != target[attr]; 
                    break;
                case 'linear':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                case 'ease-in':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                default:
                    status = iCurrent != target[attr]; 
            }

            if (status) {
                flag = false; 
                //opacity 和 scrollTop 需要特殊处理
                if (attr === "opacity") {
                    element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                    element.style.opacity = (iCurrent + iSpeed) / 100;
                } else if (attr === 'scrollTop') {
                    element.scrollTop = iCurrent + iSpeed;
                }else{
                    element.style[attr] = iCurrent + iSpeed + 'px';
                }
            } else {
                flag = true;
            }

            if (flag) {
                clearInterval(element.timer);
                if (callback) {
                    callback();
                }
            }
        })
    }, 20);
}

/**
 * 事件统计
 */
export const log = (key, val = '', level = '') => {
    if (!key && !val) {
        return;
    }
    if (typeof val == "object") {
        val = JSON.stringify(val);
    }
    if (typeof _hmt != "undefined") {
        _hmt.push(['_trackEvent', key, val]);
    }
    else {
        console.log("统计组件未加载完成");
    }
    //jd统计
    if(key.indexOf("MJingFen")==0 && typeof MPing != "undefined"){
        try{
            let click = new MPing.inputs.Click(key);         // 构造click 请求
            click.event_param = val;            // 设置click的参数
            click.event_level = level;    // 设置事件等级
            click.updateEventSeries();          // 更新事件串
            let mping = new MPing();            // 构造上报实例
            mping.send(click);                  // 上报click
            console.log("log-ok:key:" + key + " val:" + val);
        } catch (e){
            console.log(e)
        }
    }
}

/** var reg = /^[\u4E00-\u9FA5A-Za-z0-9_\(\)]+$/;
 * 是否emoji表情
 * @param str
 * @returns {boolean}
 */
export const isEmoji = str => {
    if (str) {
        var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
/**
 *是否正常字符 汉字 数字 字符 _ ()组成 
 * 添加空格判断（包含空格算合法字符）
 * @param str
 * @returns {boolean}
 */
export const isNormal = str => {
    if (str) {
        var reg = /^[\u4E00-\u9FA5A-Za-z0-9_\s*\(\)]+$/;
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
/**
 * 字符串是否为空 空字符视为空
 * 例子：
 * util.str.isEmpty() true
 * util.str.isEmpty(" ") true
 * util.str.isEmpty("") true
 * util.str.isEmpty(" 123 ") false
 * @param str
 * @returns {boolean}
 */
export const isEmpty = str => {
    if (str && /\S+/.test(str)) {
        return false;
    }
    return true;
}

/**
 * trim
 * 去前后空格
 */
export const trim = str =>{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 是否微信
 * @returns {boolean}
 */
export const isWeiXin = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 是否App
 * @returns {boolean}
 */
export const isApp = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf("junion") != -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 验证手机号
 * @returns {boolean}
 */
export const isMobile = mobile => {
    let reg = /^1\d{10}$/;
    return reg.test(mobile);
}

/**
 * 获取app信息
 * @returns {os:android,version:1.0.0}
 */
export const getAppInfo = () => {
    if (isApp()) {
        //junion-app-ios-1.0.0
        let ua = window.navigator.userAgent.toLowerCase();
        let reg = /junion-app-(\S+)-(\d+.\d+.\d+)/;
        let match = ua.match(reg);
        let isNative=false;
        if(ua.indexOf("reactnative")>-1){
        	isNative=true;
        }
        if (match && match.length == 3) {
            return {
                os: match[1],
                version: match[2],
                isNative:isNative
            };
        }
    }
    return null;
}

export const isOk = (data, showError) => {
    if (showError == undefined) showError = true;
    if (data.err_code === 0) {
        return true;
    }
    if (showError && data.err_code !== 0) {
        if (data.err_msg == "") data.err_msg = "网络错误！";
        $j.toast(data.err_msg);
    }
    return false;
}

/*
*  进入商详与活动的 连接后面 加参 给app 用
*  type  0 商详  1活动
* */
export const appParameter  = param => {
    let lianmengAppParameter = {
        id: param.id,
        type: param.type,
        title: param.title,
        imageurl: param.imageurl,
        content: param.content,
        opeurl: param.url
    };
    let promotionType;
    let geturl;
    let param1={};
    if(param.type == 0){
        lianmengAppParameter.price = param.price;
        promotionType  = 1;
        geturl = "/adv/getAdvCode?type=1&promotionType=" + promotionType + "&materialId=" + param.id ;
        param1={type:1,promotionType:promotionType,materialId:param.id};
    }else{
        promotionType  = 30;
        geturl = "/adv/getAdvCode?type=1&promotionType=" + promotionType + "&materialId=" + param.id +"&url="+ lianmengAppParameter.opeurl;
        param1={type:1,promotionType:promotionType,materialId:param.id,url:lianmengAppParameter.opeurl};
    }
    /*获取赚钱的url*/
    //getProxy(geturl, {type: 'GET', contentType: 'application/x-wwww-form-urlencoded'}).then(res => {
    jsonpProxyApiX("getAdvCode",param1).then(res => {
        if (res.err_code === 0) {
           lianmengAppParameter.url = res.data.url;
           let addurl = encodeURIComponent(encodeURIComponent(JSON.stringify(lianmengAppParameter)));
            // console.log(JSON.stringify(lianmengAppParameter));
           if(lianmengAppParameter.opeurl.indexOf('?') > 0){
               lianmengAppParameter.opeurl += "&lianmengAppParameter="+addurl;
           }else{
               lianmengAppParameter.opeurl += "?lianmengAppParameter="+addurl;
           }
           //延迟为了等待日志记录完成
           setTimeout(() => {
               location.href = lianmengAppParameter.opeurl;
           },100);
       }else{
            $j.toast(res.err_msg)
       }
    })
};

/**
 * 分享业务功能 包括分享 商品、店铺、活动
 * @param {type:'',id:'',img:'',title:'',content:'',actUrl:''}
 * type 分享类型 : product （商品）、shop（店铺）、activity（活动）
 * id 对应的 商品ID/店铺ID/活动Id
 * actUrl 活动列表中的actUrl参数
 */
export const shareBiz = (param, callback) => {
    console.log(param);
    let type = 1;
    let msg = "暂时无法分享，请稍后再试";
    if (param.type == "product") {
        type = 1;
        msg = "暂时无法分享该商品，请稍后再试";
    } else if (param.type == "shop") {
        type = 2;
    } else if (param.type == "activity") {
        type = 30;
        msg = "暂时无法分享该活动，请稍后再试";
    }
    let url = "/adv/getAdvCode?type=1&promotionType=" + type + "&materialId=" + param.id;
    let param1={type:1,promotionType:type,materialId:param.id};
    if (param.type == "activity") {
        url = url + "&url=" + encodeURIComponent(param.actUrl);
        param1.url=encodeURIComponent(param.actUrl);
    }
    jsonpProxyApiX('getAdvCode',param1).then(res => {
    //getProxy(url).then(res => {
        if (res.err_code == 121) {
            $j.confirm({
                title: [
                    '提示',
                ],
                content: '您还没有默认推广位，快去设置吧',
                btn: ['确定', '取消'],
                yes: function(){
                    location.href = "/me_settgw";
                }
            });
        } else if (res.err_code == 0) {
            share({
                ...param,
                id: param.id,
                img: param.img,
                url: res.data.url,
                title: param.title,
                content: param.content
            }, callback);
        }
    }).catch(e => {
        console.log(e)
        $j.toast(msg)
    })
}

/**
 * 微信或app 分享功能
 * 如果app调用本地分享，如果微信调用微信分享，否则不分享
 * @param {img:'',url:'',title:'',content:''}
 * isExist 防止快速点击重复出现id=weixin
 */
export const share = (param, callback) => {
    console.log(param)
    if (isWeiXin()) {
        setWxShareData(param);
        callback(0, "已设置分享内容，请点击右上角分享！")
        //弹框显示禁止拖动下面的页面
        // $("#weixin").on('touchmove',function(event) {
        //     event.preventDefault();
        // }, false);
       // $j.toast("已设置分享内容，请点击右上角分享！");
    } else if (isApp()) {
        let appInfo = getAppInfo();
        let version = appInfo && appInfo['version'];
        let url;
        if(parseInt(version) == '2' && param.type == 'product'){
            url = "junion://j.u?act=productShare"
                    + "&json=" + encodeURIComponent(JSON.stringify(param));
        }else{
            url = "junion://j.u?act=share"
                + "&id=" + param.id
                + "&title=" + encodeURIComponent(param.title)
                + "&content=" + encodeURIComponent(param.content)
                + "&imageurl=" + encodeURIComponent(param.img)
                + "&url=" + encodeURIComponent(param.url);
        }

        location.href = url;
    } else {
        callback(-1, "请到京粉APP或微信公众号进行推广！")
        // $j.toast("请到京粉APP或微信公众号进行推广！");
    }
}

/**
 * 到计时
 * @param element
 * @param format  例子：yyyy-MM-dd h:m:s
 */
export const timeOut = (element, moblie, urlData) => {
    let validCode = true;
    let code= document.querySelector(element);

    let timeOutFun = () => {
        let tel = document.querySelector(moblie).value;

        if(!tel){
            $j.toast("请填写手机号码！");
            return false;
        }
        if(tel.indexOf("*") != -1){
            tel = "";
        }else{
            if(!isMobile(tel)){
                $j.toast('手机号码格式错误，请重新输入！');
                return false;
            }   
        }
        let time = 60;
        let urls = urlData || "/getSmsVerifyCode";
        urls = urls + "?mobile=" + tel;
        if (validCode) {
            validCode = false;
            code.innerHTML = time+"秒";
            code.classList.add("msg-time");
            jsonpProxyApiX(urls.substr(1,urls.length-1),{}).then(res => {
           // getProxy(urls).then(res => {
                if(isOk(res)){
                    $j.toast("获取验证码成功");
                }
            })

            let t = setInterval(() => {
                time--;
                code.innerHTML = time+"秒";
                if (time == 0) {
                    clearInterval(t);
                    code.innerHTML = "重新获取";
                    validCode = true;
                    code.classList.remove("msg-time");
    
                }
            },1000)
        }
    }

    code.removeEventListener("click", timeOutFun);
    code.addEventListener("click", timeOutFun);
}

/**
 * 时间戳转换为时间字符
 * @param timestamp
 * @param format  例子：yyyy-MM-dd h:m:s
 */
export const formatDate = (timestamp, format) => {
    let newDate = new Date();
    newDate.setTime(timestamp);
    Date.prototype.formats = format => {
        let date = {
            "M+": newDate.getMonth() + 1,
            "d+": newDate.getDate(),
            "h+": newDate.getHours(),
            "m+": newDate.getMinutes(),
            "s+": newDate.getSeconds(),
            "q+": Math.floor((newDate.getMonth() + 3) / 3),
            "S+": newDate.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
                        .substr(("" + date[k]).length));
            }
        }
        return format;
    }
    return newDate.formats(format);
}


/**
 * 验证手机号
 * @returns {boolean}
 */
export const get_scrollTop_of_body = () => {
    var scrollTop; 
    if(typeof window.pageYOffset != 'undefined'){//pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset; 
    }else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat'){ 
        scrollTop = document.documentElement.scrollTop; 
    }else if(typeof document.body != 'undefined'){ 
        scrollTop = document.body.scrollTop; 
    } 
    return scrollTop; 
}