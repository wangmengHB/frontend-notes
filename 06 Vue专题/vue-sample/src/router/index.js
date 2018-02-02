import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const PageLayout = () => import('@/components/layout/PageLayout.vue')
const ECardList = () => import('@/components/ECardList/ECardList.vue')
const AccountList = () => import('@/components/AccountList/AccountList.vue')
const TemplateMgmt = () => import('@/components/TemplateMgmt/TemplateMgmt.vue')
const UserLogin = () => import('@/components/UserLogin/UserLogin.vue')




Vue.use(Router)

const needAuth = false;


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
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

  // if (to.meta.requireAuth) {
  //   let params = {
  //     token: token? token: ''
  //   }
  //   authValidation(params).then(res => {
  //     console.log(res);
  //     // if (res.code == 200) {
  //     //   window.localStorage.setItem('user', res.result);
  //     //   next()
  //     // } else if (res.code == 400) {
  //     //   window.location.href = res.url;
  //     // } else {
  //     //   window.location.href = res.url;            
  //     // }
  //   }).catch(function (error) {
  //     console.log(error); 
  //   });
  // }

  // for test

  if (!to.meta.requireAuth) {
    next();
  }

})


router.afterEach((to, from) => {
  store.commit('SET_ACTIVE_PAGE',to.name)
})


export default router

