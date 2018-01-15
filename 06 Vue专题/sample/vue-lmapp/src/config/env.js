/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式，有hash和history两种模式，history模式不支持刷新
 * imgBaseUrl: 图片所在域名地址
 * loginUrl：登录跳转地址
 * jsonpCallbackFunction: jsonp回调函数默认配置
 * 
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl = 'https://img12.360buyimg.com/cms';
let loginUrl = 'https://plogin.m.jd.com/user/login.action?appid=253&otherlogin=false&returnurl='+encodeURIComponent(location.protocol+"//"+document.domain+(location.port? (":"+location.port): ""));
let jsonpCallbackFunction = null;
//预发未  true  ,线上false
let yfbmedia = true;

if (process.env.NODE_ENV == 'development') {

}else if(process.env.NODE_ENV == 'production'){

	// baseUrl = 'http://cangdu.org:8001';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
	loginUrl,
	jsonpCallbackFunction,
	yfbmedia,
}