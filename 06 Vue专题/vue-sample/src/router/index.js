import Vue from 'vue'
import Router from 'vue-router'


const PageLayout = resolve => require(['@/components/layout/PageLayout.vue'], resolve)
const ECardList = resolve => require(['@/components/ECardList/ECardList.vue'], resolve)
const AccountList = resolve => require(['@/components/AccountList/AccountList.vue'], resolve)
const TemplateMgmt = resolve => require(['@/components/TemplateMgmt/TemplateMgmt.vue'], resolve)


Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      redirect: '/admin/ecard',
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
        }, {
          path: 'accout',
          name: 'accountlist',
          component: AccountList,
        }, {
          path: 'template',
          name: 'templatemgmt',
          component: TemplateMgmt
        }
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {
  next();
})

router.afterEach((to, from) => {

})



export default router

