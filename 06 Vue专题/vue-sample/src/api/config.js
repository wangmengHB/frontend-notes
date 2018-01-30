import axios from 'axios'
import indicator from './indicator.js'

const isDevEnv = () => {
    if (window.location.host == 'dev.ba.dui.ai' || 
        ~window.location.host.indexOf('localhost')
    ) {
        return true;
    }
    return false;
}

// 统一错误处理 忽视的接口
const reponse_interceptor_ignor = ['/v1/auth/validation'] 
// 错误时 显示result信息的接口
const error_show_result = ['/v1/topic/excel','/v1/kg/kgFile']

/**
 * 本地环境
 **/
// let base = '/api';
// let authorizer = '/authorizer';

/**
 * 线上环境
 **/
// let base = 'http://ba.dui.ai:8080/api';
// let base = 'http://47.96.191.103:9080/api'
// let base = 'http://120.27.216.199:8080/api';
// let authorizer = 'http://dev.wx.dui.ai/authorizer';

let base,authorizer;
if (isDevEnv()) {
    // base = 'http://dev.ba.dui.ai:8080/api'
    base = 'http://120.27.216.199:9080/api';
	authorizer = 'http://dev.wx.dui.ai/authorizer';
} else {
	base = `http://${location.host}/api`
	authorizer = `http://${location.host.replace(/\.ba\./,'.wx.')}/authorizer`;
}




/**
 *  携带cookie
 **/
axios.defaults.withCredentials = true;






axios.interceptors.request.use(function (config) {
	// indicator.showBusy()
    // Do something before request is sent
    return config;
  }, function (error) {
  	indicator.checkStatus()
    // Do something with request error
    return Promise.reject(error);
  });



axios.interceptors.response.use(
	function (response) {
        indicator.checkStatus()
        if (response.data.code == 200) {
            return response;
        }
        let url = response.config.url
        if(arrIncludeItem(reponse_interceptor_ignor,url)) {
            return response;
        }

        if(arrIncludeItem(error_show_result,url)){
            indicator.message({
                showClose:true,
                message:response.data.msg+','+response.data.result,
                type: 'error',
                duration:5000
            })
            return
        }

        if(response.data.msg){
            indicator.error(response.data.msg+','+response.data.result)
        }
        return

	},
	function (error) {
		indicator.checkStatus()
		indicator.error('服务器错误')
		// return Promise.reject(error);
	}
);


export {
    base
}
