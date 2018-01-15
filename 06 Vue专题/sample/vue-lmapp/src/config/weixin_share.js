import {isWeiXin} from './mUtils'
import {getWeixinInfo} from '../service/getData'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

export const weixinShare = () => {
    if (!isWeiXin())
        return;

    getWeixinInfo().then(res => {
        if (res.err_code == 0) {
            let data = res.data;
            window.wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
                    'onMenuShareQZone', 'chooseWXPay', 'startRecord', 'stopRecord', 'onVoiceRecordEnd',
                    'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice',
                    'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType',
                    'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems',
                    'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow',
                    'scanQRCode', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
            });
            wxListener(data);
        }
    })
}

//监听js-sdk是否验证成功
export const wxListener = () => {
    window.wx.ready(() => {
        console.log('wxsdk ok');
    });
    window.wx.error(res => {
        console.log('wxsdk error');
    });
};

export const setWxShareData = (param) => {
    let shareParam = {
        "imgUrl": param.img,
        "link": param.url,
        "desc": param.content,
        "title": param.title,
        success: function () {
            
        },
        cancel: function () {

        }
    };
    $j.toast(JSON.stringify(shareParam))
    if (typeof window.wx != "undefined") {
        window.wx.onMenuShareTimeline(shareParam);
        window.wx.onMenuShareAppMessage(shareParam);
        window.wx.onMenuShareQQ(shareParam);
        window.wx.onMenuShareWeibo(shareParam);
        window.wx.onMenuShareQZone(shareParam);
    }
}