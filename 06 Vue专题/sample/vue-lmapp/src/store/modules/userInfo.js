import {setStore, getStore, removeStore} from '../../config/mUtils'
import {getUser} from '../../service/getData'
import {jsonpProxyApiX} from '../../service/proxy'

import {GET_USERINFO,RECORD_USERINFO} from '../mutation-types'

const state = {
	userInfo: null, //用户信息
	isLogin: false,//是否登录
}

// getters
const getters = {
  userInfo: state => state.userInfo,
  isLogin: state => state.isLogin
}

// actions
const actions = {
	async getUserInfo({
		commit,
		state
	}) {
		//let res = await getUser('/userInfoMediaApp');
		let res=await jsonpProxyApiX('userInfoMediaApp',{},{noFilter:true});
		commit(GET_USERINFO, res)
	}
}

const mutations = {
	//获取用户信息存入vuex
	[GET_USERINFO](state, info) {
	    let code = info.err_code;
	    if ("204" == code  || "205" == code || "201" == code ||"202" == code) {
	    	removeStore('isLogin');
	    }else{
	        state.isLogin = true;
	        setStore('isLogin', true);
	    }

		if (info.data) {
			state.userInfo = {...info.data};
			setStore('userInfo', true);
		} else {
			state.userInfo = null;
		}
	},
	// 记录用户信息
	[RECORD_USERINFO](state, info) {
		state.userInfo = info;
		state.isLogin = true;
		setStore('user_id', info.unionId);
	},
}

export default {
    state,
    getters,
    actions,
    mutations
}