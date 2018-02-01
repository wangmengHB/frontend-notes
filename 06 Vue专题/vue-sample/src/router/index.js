import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import {authValidation} from '../api'

const PageLayout = resolve => require(['@/components/layout/PageLayout.vue'], resolve)
const ECardList = resolve => require(['@/components/ECardList/ECardList.vue'], resolve)
const AccountList = resolve => require(['@/components/AccountList/AccountList.vue'], resolve)
const TemplateMgmt = resolve => require(['@/components/TemplateMgmt/TemplateMgmt.vue'], resolve)
const UserLogin = resolve => require(['@/components/UserLogin/UserLogin.vue'], resolve)



Vue.use(Router)

const needAuth = false;


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: UserLogin,
      // redirect: '/admin/ecard',
    },
    {
      path: '/admin',
      name: 'admin',
      component: PageLayout,
      redirect: '/admin/ecard',
      children: [
        {
          path: 'ecard',
          name: 'ecardlist',
          component: ECardList,
          meta: {
            requireAuth: needAuth,
          }
        }, {
          path: 'accout',
          name: 'accountlist',
          component: AccountList,
          meta: {
            requireAuth: needAuth,
          }
        }, {
          path: 'template',
          name: 'templatemgmt',
          component: TemplateMgmt,
          meta: {
            requireAuth: needAuth,
          }
        }
      ]
    }
  ]
})

let tokenVerify = true;
router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token');
  if (to.query.token && tokenVerify) {
    token = to.query.token;
    window.localStorage.setItem('token', token);  
    tokenVerify = false;
  }

  if (to.meta.requireAuth) {
    let params = {
      token: token? token: ''
    }
    authValidation(params).then(res => {
      console.log(res);
      // if (res.code == 200) {
      //   window.localStorage.setItem('user', res.result);
      //   next()
      // } else if (res.code == 400) {
      //   window.location.href = res.url;
      // } else {
      //   window.location.href = res.url;            
      // }
    }).catch(function (error) {
      console.log(error); 
    });
  }

  // for test

  if (!to.meta.requireAuth) {
    next();
  }

})


router.afterEach((to, from) => {
  store.commit('SET_ACTIVE_PAGE',to.name)
})


export default router

