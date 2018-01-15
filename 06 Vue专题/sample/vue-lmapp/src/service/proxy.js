/**
 * fetch请求
 * 
 * fetch(url, data, options)
 * url: 请求地址
 * data: 请求参数
 * options: seconds本地缓存时间，type请求类型，jsonpCallback: 回调函数取参key值，jsonpCallbackFunction: jsonp回调函数默认配置
 * 
 */

import fetch from '../config/fetch'
import {jsonpProxyApi} from '../config/fetch'

import {getStore} from '../config/mUtils'

/**
 * get请求
 */

export const getProxy = (targetUrl, options = 'GET') => fetch('proxy', {url: targetUrl}, options);

/**
 * post请求
 */

export const postProxy = (targetUrl, data, options = 'POST') => fetch('proxy?url=' + targetUrl, data, options);

/**
 * JsonP请求网关
 */

export const jsonpProxyApiX = (functionId, body,options) => jsonpProxyApi(functionId,body,options);