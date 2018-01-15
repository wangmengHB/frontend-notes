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
import {getStore} from '../config/mUtils'

/**
 * 获取用户信息
 */

export const getUser = (targetUrl) => fetch('proxy', {url: targetUrl}, {type: 'GET', noFilter: true});

/**
 * 微信分享
 */

export const getWeixinInfo = () => fetch('/weixin', {
	action: 'getwxjsconfig',
	v: new Date().getTime()
});

/**
 * jsonp
 */

export const getJsonp = () => fetch('http://assets.airbnb.com/frontend/search_results.js', {}, {type: 'jsonp', jsonpCallbackFunction: 'search_results', seconds: 60});