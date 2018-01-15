import {
	baseUrl, loginUrl, jsonpCallbackFunction, yfbmedia, agentDomain
} from './env'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'
import { getAppInfo,isApp } from './mUtils.js'

/**
 * jsonp默认设置
 * 
 * timeout: 超时时间
 * jsonpCallback: 回调函数取参key值
 * jsonpCallbackFunction: jsonp回调函数默认配置
 * 
 */
const defaultOptions = {
	timeout: 5000,
	jsonpCallback: 'callback',
	jsonpCallbackFunction: jsonpCallbackFunction,
};

/**
 * dataFilter在请求成功之后调用
 * 
 * 
 */
const dataFilter = (result) => {
	let url = loginUrl;
	//console.log(data);
	if (result.err_code == 204 || result.err_code == 205 || result.err_code == 201 || result.err_code == 202) {
		if (result.err_msg.indexOf("开普勒") != -1) {
			//开普勒用户现暂时没有权限登陆京粉网站
			//如果跳到登录页面会自动跳回 形成死循环
			location.href = "/home";
		} else if (result.err_msg.indexOf("获取商品推广数据失败") != -1) {
			//nothing todo
		} else {
			location.href = url;
		}
	} else if (result.err_code == 2) {
		url = "/register.jsp";
		$j.toast(result.err_msg);
		//当前页面不是注册页面则跳转到注册页面
		if (location.href.indexOf("register.jsp") == -1) {
			setTimeout(() => {
				location.href = url;
			}, 10);
		}
	} else if (result.err_code == 226) {
		$j.toast(result.err_msg);
	} else if (result.err_code == 206) {
		url = "/old_user_login.jsp";
		$j.toast(result.err_msg);
		if (location.href.indexOf("old_user_login.jsp") == -1) {
			setTimeout(() => {
				location.href = url;
			}, 10);
		}
	}
	return result;
}

const hashstr = s => {
	let hash = 0;
	if (s.length == 0) return hash;
	for (let i = 0; i < s.length; i++) {
		let char = s.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

export default async (url = '', data = {}, options = 'GET', method = 'fetch') => {
	url = baseUrl + url;
	let expiry = null; //缓存时间
	let type = 'GET';
	let noFilter = false;
	let timeout = null;
	let accept = null;
	let contentType = null;
	let timeoutId;
	let jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;
	let callbackFunction = options.jsonpCallbackFunction || jsonpCallbackFunction || generateCallbackFunction();
	if (typeof options === 'number') {
		expiry = options;
		options = undefined;
	} else if (typeof options === 'string') {
		type = options.toUpperCase();
	} else if (typeof options === 'object') {
		// I hope you didn't set it to 0 seconds
		type = (options.type || type).toUpperCase();
		noFilter = options.noFilter || noFilter;
		expiry = options.seconds || expiry;
		accept = options.accept || accept;
		contentType = options.contentType || contentType;
		timeout = options.timeout || timeout || defaultOptions.timeout;
		if (type == 'JSONP' && callbackFunction) data[jsonpCallback] = callbackFunction;
	}

	if (type == 'GET' || type == 'JSONP') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (url.indexOf('proxy?url=') == -1) {

	} else if (yfbmedia) {
		url = url.replace('proxy?url=/', '');
		// let urls = url.split('?')
		// url = urls[0] + (urls[1]? ('?' + encodeURIComponent(urls[1])) : '')
	} else {
		url = url.replace('proxy?url=', '');
		url = 'proxy?url=' + encodeURIComponent(url);
	}

	// Use the URL as the cache key to localStorage
	let cacheKey = hashstr(url)
	let cached = localStorage.getItem(cacheKey)
	let whenCached = localStorage.getItem(cacheKey + ':ts')
	if (cached !== null && whenCached !== null) {
		// it was in localStorage! Yay!
		// Even though 'whenCached' is a string, this operation
		// works because the minus sign tries to convert the
		// string to an integer and it will work.
		let age = (Date.now() - whenCached) / 1000
		if (age < expiry) {
			let response = new Response(new Blob([cached]))
			const responseJson = await response.json();
			return Promise.resolve(responseJson)
		} else {
			// We need to clean up this old key
			localStorage.removeItem(cacheKey)
			localStorage.removeItem(cacheKey + ':ts')
		}
	}
	if (type == 'JSONP') {
		return fetchJsonp(url, options)
	}

	// if (window.fetch && method == 'fetch' && window.navigator.userAgent.toLowerCase().indexOf('ucbrowser') == -1) {
	// 	let requestConfig = {
	// 		credentials: 'include',
	// 		method: type,
	// 		headers: {
	// 			'Accept': options.accept || '*/*',
	// 			'Content-Type': options.contentType || 'application/json'
	// 		},
	// 		mode: "cors",
	// 		cache: "force-cache"
	// 	}

	// 	if (type == 'POST') {
	// 		if(options.contentType == 'application/x-www-form-urlencoded'){
	// 			let queryString = '';
	// 			Object.keys(data).forEach(key => {
	// 				queryString += key + '=' + encodeURIComponent(data[key]) + '&';
	// 			})

	// 			if (queryString !== '') {
	// 				queryString = queryString.substr(0, queryString.lastIndexOf('&'));
	// 			}

	// 			Object.defineProperty(requestConfig, 'body', {
	// 				value: queryString
	// 			})
	// 		}else{
	// 			Object.defineProperty(requestConfig, 'body', {
	// 				value: JSON.stringify(data)
	// 			})
	// 		}
	// 	}

	// 	try {

	// 	    if(timeout) {
	// 	    	timeoutId = setTimeout(() => {
	// 		      	throw(new Error(`request to ${url} timed out`));
	// 		    }, timeout);
	// 	    }

	// 		const response = await fetch(url, requestConfig);

	// 		if (timeoutId) clearTimeout(timeoutId);

	// 		if(expiry) {
	// 	        response.clone().text().then(content => {
	// 				localStorage.setItem(cacheKey, content)
	// 				localStorage.setItem(cacheKey + ':ts', Date.now())
	// 	        })
	// 		}
	// 		const responseJson = await response.json();
	// 		if(noFilter) return responseJson
	// 		return dataFilter(responseJson)
	// 	} catch (error) {
	// 		throw new Error(error)
	// 	}
	// } else {
	return new Promise((resolve, reject) => {
		let requestObj;
		if (window.XMLHttpRequest) {
			requestObj = new XMLHttpRequest();
		} else {
			requestObj = new ActiveXObject;
		}

		let sendData = '';
		if (type == 'POST') {
			if (options.contentType == 'application/x-www-form-urlencoded') {
				let queryString = '';
				Object.keys(data).forEach(key => {
					queryString += key + '=' + encodeURIComponent(data[key]) + '&';
				})

				if (queryString !== '') {
					queryString = queryString.substr(0, queryString.lastIndexOf('&'));
				}

				sendData = queryString;
			} else {
				sendData = JSON.stringify(data);
			}
		}

		if (timeout) {
			timeoutId = setTimeout(() => {
				reject(new Error(`request to ${url} timed out`));
			}, timeout);
		}
		requestObj.open(type, url, true);
		requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		requestObj.send(sendData);

		requestObj.onreadystatechange = () => {
			if (requestObj.readyState == 4) {
				if (timeoutId) clearTimeout(timeoutId);

				if (requestObj.status == 200) {
					let obj = requestObj.response
					if (expiry) {
						localStorage.setItem(cacheKey, obj)
						localStorage.setItem(cacheKey + ':ts', Date.now())
					}
					if (typeof obj !== 'object') {
						obj = JSON.parse(obj);
					}
					if (noFilter) {
						resolve(obj)
					} else {
						obj = dataFilter(obj)
						resolve(obj)
					}
				} else {
					reject(requestObj)
				}
			}
		}
	})
	// }
}




const generateCallbackFunction = () => {
	return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
}

const clearFunction = functionName => {
	// IE8 throws an exception when you try to delete a property on window
	// http://stackoverflow.com/a/1824228/751089
	try {
		delete window[functionName];
	} catch (e) {
		window[functionName] = undefined;
	}
}

const removeScript = scriptId => {
	const script = document.getElementById(scriptId);
	if (script) {
		document.getElementsByTagName('head')[0].removeChild(script);
	}
}

export const fetchJsonp = (_url, options = {}) => {
	// to avoid param reassign
	let url = _url;
	//let cacheKey = hashstr(url);
	let expiry = null; //缓存时间
	expiry = options.seconds || expiry;
	const timeout = options.timeout || defaultOptions.timeout;
	const jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

	let timeoutId;

	return new Promise((resolve, reject) => {
		const callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
		const scriptId = `${jsonpCallback}_${callbackFunction}`;

		window[callbackFunction] = (response) => {
			resolve({
				ok: true,
				// keep consistent with fetch API
				json: () => Promise.resolve(response),
			});

			if (timeoutId) clearTimeout(timeoutId);

			removeScript(scriptId);

			clearFunction(callbackFunction);

			if (expiry) {
				if (typeof response === 'object') {
					response = JSON.stringify(response);
				}
				localStorage.setItem(cacheKey, response)
				localStorage.setItem(cacheKey + ':ts', Date.now())
			}
		};

		// Check if the user set their own params, and if not add a ? to start a list of params
		if (url.indexOf(`${jsonpCallback}=`) === -1) {
			url += (url.indexOf('?') === -1) ? '?' : '&';
			url = `${url}${jsonpCallback}=${callbackFunction}`;
		}


		const jsonpScript = document.createElement('script');
		jsonpScript.setAttribute('src', url);
		if (options.charset) {
			jsonpScript.setAttribute('charset', options.charset);
		}
		jsonpScript.id = scriptId;
		document.getElementsByTagName('head')[0].appendChild(jsonpScript);

		if (timeout) {
			timeoutId = setTimeout(() => {
				reject(new Error(`JSONP request to ${_url} timed out`));

				clearFunction(callbackFunction);
				removeScript(scriptId);
			}, timeout);
		}

		// Caught if got 404/500
		jsonpScript.onerror = () => {
			reject(new Error(`JSONP request to ${_url} failed`));

			clearFunction(callbackFunction);
			removeScript(scriptId);
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
}

/**
 * 添加JsonpApi  网关方法
 */
export const jsonpProxyApi = (functionId, body, options) => {
	var ishttps = 'https:' == document.location.protocol ? true: false;
	var httpCategory=ishttps?"https":"http";
	let adomin = httpCategory+'://api.m.jd.care/?';
	if (yfbmedia) {
		adomin = httpCategory+'://beta-api.m.jd.com/?';
	}
	var bodyStr = "";
	if (typeof body === "object") {
		bodyStr = JSON.stringify(body);
	}
	let appInfo = getAppInfo();
	let version = appInfo ? appInfo["version"] : "2.1.0";
	let url = adomin + "functionId=" + functionId + '&client=JingFenApp&clientVersion=' + version + '&body=' + bodyStr;
	let cacheKey = hashstr(url);
	let _url = url;
	if (options == null) {
		options = {};
	}

	let expiry = null; //缓存时间
	let noFilter = false;
	expiry = options.seconds || expiry;
	const timeout = options.timeout || defaultOptions.timeout;
	const jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;
	noFilter = options.noFilter || noFilter;
	let timeoutId;

	return new Promise((resolve, reject) => {
		const callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
		const scriptId = `${jsonpCallback}_${callbackFunction}`;

		window[callbackFunction] = (response) => {
			if (noFilter) {
				resolve(response);
			} else {
				resolve(dataFilter(response));
			}


			if (timeoutId) clearTimeout(timeoutId);

			removeScript(scriptId);

			clearFunction(callbackFunction);

			if (expiry) {
				if (typeof response === 'object') {
					response = JSON.stringify(response);
				}
				localStorage.setItem(cacheKey, response)
				localStorage.setItem(cacheKey + ':ts', Date.now())
			}
		};

		// Check if the user set their own params, and if not add a ? to start a list of params
		if (url.indexOf(`${jsonpCallback}=`) === -1) {
			url += (url.indexOf('?') === -1) ? '?' : '&';
			url = `${url}${jsonpCallback}=${callbackFunction}`;
		}


		const jsonpScript = document.createElement('script');
		jsonpScript.setAttribute('src', url);
		if (options.charset) {
			jsonpScript.setAttribute('charset', options.charset);
		}
		jsonpScript.id = scriptId;
		document.getElementsByTagName('head')[0].appendChild(jsonpScript);

		if (timeout) {
			timeoutId = setTimeout(() => {
				reject(new Error(`JSONP request to ${_url} timed out`));

				clearFunction(callbackFunction);
				removeScript(scriptId);
			}, timeout);
		}

		// Caught if got 404/500
		jsonpScript.onerror = () => {
			reject(new Error(`JSONP request to ${_url} failed`));

			clearFunction(callbackFunction);
			removeScript(scriptId);
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
}



