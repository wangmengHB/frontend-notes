import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const bannerJump = r => require.ensure([], () => r(require('../page/home/bannerJump')), 'bannerJump')
const register = r => require.ensure([], () => r(require('../page/register/register')), 'register')
const agreement = r => require.ensure([], () => r(require('../page/register/children/agreement')), 'agreement')
const old_user_login = r => require.ensure([], () => r(require('../page/old_user_login/old_user_login')), 'old_user_login')
const translink = r => require.ensure([], () => r(require('../page/translink/translink')), 'translink')
const tutorial = r => require.ensure([], () => r(require('../page/translink/children/tutorial')), 'tutorial')
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search')
const search_sku = r => require.ensure([], () => r(require('../page/search/search_sku')), 'search_sku')
const promotion_product = r => require.ensure([], () => r(require('../page/promotion_product/promotion_product')), 'promotion_product')
const share_middlepage = r => require.ensure([], () => r(require('../page/share_middlepage/share_middlepage')), 'share_middlepage')
const promotion_activity = r => require.ensure([], () => r(require('../page/promotion_activity/promotion_activity')), 'promotion_activity')
const me = r => require.ensure([], () => r(require('../page/me/me')), 'me')
const me_about = r => require.ensure([], () => r(require('../page/me/me_about')), 'me_about')
const me_msg_details = r => require.ensure([], () => r(require('../page/me/me_msg_details')), 'me_msg_details')
const helpnew = r => require.ensure([], () => r(require('../page/me/helpnew')), 'helpnew')
const me_msg = r => require.ensure([], () => r(require('../page/me/me_msg')), 'me_msg')
const report = r => require.ensure([], () => r(require('../page/report/report')), 'report')
const report_show_more = r => require.ensure([], () => r(require('../page/report/report_show_more')), 'report_show_more')
const record= r => require.ensure([], () => r(require('../page/report/record')), 'record')
const orderlist= r => require.ensure([], () => r(require('../page/report/orderlist')), 'orderlist')
const orderdetails= r => require.ensure([], () => r(require('../page/report/orderdetails')), 'orderdetails')
export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/home'
        },
        //地址为空时跳转home页面
        {
            path: 'index.html',
            redirect: '/home'
        },
        //首页城市列表页
        {
            path: '/home',
            component: home,
            // meta: { keepAlive: true },
        },
        {
            path: '/bannerJump',
            component: bannerJump
        },
        {
            path: '/register',
            component: register,
            // meta: { requiresAuth: true }
            children: [{
                path: 'agreement',
                component: agreement,
            },]
        },
        //首页城市列表页
        {
            path: '/old_user_login',
            component: old_user_login,
            // meta: { keepAlive: true },
        },
        {
            path: '/translink',
            component: translink,
            children: [{
                path: 'tutorial',
                component: tutorial,
            },]
        },
        {
            path: '/search',
            component: search
        },
        {   //搜索结果页
            path: '/search_sku',
            component: search_sku,
            //meta: {keepAlive:true }
         },
        {
            path: '/promotion_product',
            component: promotion_product,
           // meta: {keepAlive:true }
        },
        {
            path: '/share_middlepage',
            component: share_middlepage
        },
        {
            path: '/promotion_activity',
            component: promotion_activity
        },
        {
            path: '/me',
            component: me,
            meta: { requiresAuth: true }
        },
        {
            path: '/me_about',
            component: me_about,
        },
        {
            path: '/helpnew',
            component: helpnew,
        },
        {
            path: '/me_msg',
            component: me_msg,
            meta: { requiresAuth: true,keepAlive:true }
        },   
        {
            path: '/report',
            component: report,
            meta: { requiresAuth: true }
        },
        {
            path: '/report_show_more',
            component: report_show_more,
            meta: { requiresAuth: true }
        }, 
        //提现记录
         {
            path: '/record',
            component: record,
            meta: { requiresAuth: true }
         },
        {
            path: '/orderlist',
            component: orderlist,
            meta: { requiresAuth: true,keepAlive:true }
         },
            {
            path: '/orderdetails',
            component: orderdetails,
         },
         {
              path: '/me_msg_details',
              component: me_msg_details,
         }, 
    ]
}]