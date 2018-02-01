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


/**
 * 本地环境
 **/
// let base = '/api';

/**
 * 线上环境
 **/


let base;
if (isDevEnv()) {
    base = 'http://120.27.216.199:9080/api';
} else {
	base = `http://${location.host}/api`
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
  	indicator.hideBusy()
    // Do something with request error
    return Promise.reject(error);
  });



axios.interceptors.response.use(
	function (response) {
        indicator.hideBusy()
        if (response.data.code == 200) {
            return response;
        }

        if(response.data.msg) {
            indicator.error(response.data.msg+','+response.data.result);
            return response;
        }
        
	},
	function (error) {
		indicator.hideBusy()
		indicator.error('服务器错误')
		// return Promise.reject(error);
	}
);


export {
    base
}
