import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode, loginUrl} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import {setStore, getStore, removeStore} from './config/mUtils'
import {jsonpProxyApiX} from './service/proxy.js'

import {getUser} from 'src/service/getData'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition ||0}
		}
	}
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    try{
      if(!router.app.$store.state.userInfo.isLogin){
       // getUser('/userInfoMediaApp').then(res => {
       jsonpProxyApiX('userInfoMediaApp',{}).then(res => {
          let code = res.err_code;
          if ("204" == code  || "205" == code || "201" == code ||"202" == code) {
            location.href = loginUrl;
          }else{
            router.app.$store.state.userInfo.isLogin = true;
            router.app.$store.state.userInfo.userInfo = res.data;
            next()
          }
        }).catch(e => {
          console.log('接口获取失败');
          //$j.toast('接口获取失败')
        })
      } else {
        next()
      }
    }catch(e){
      if(typeof e == 'object') e = JSON.stringify(e)
      $j.toast(e)
    }
  } else {
    next() // 确保一定要调用 next()
  }
})



new Vue({
	router,
	store,
}).$mount('#app')

