// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

import './assets/css/zxx.css'
import './assets/font/iconfont.js'
import './assets/font/iconfont.css'
import './assets/scss/app.scss'

import components from '@/func_components'
import i18n from './i18n'





Vue.use(ElementUI)
Vue.prototype.$loading = ElementUI.Loading;

Object.keys(components).forEach((key) => {
  Vue.component(`z-${key}`, components[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
