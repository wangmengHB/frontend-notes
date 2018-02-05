import Vue from 'vue'
import Vuex from 'vuex'
import global from './modules/global'
import md5 from 'md5'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    loginName: sessionStorage.getItem('loginName'),
    loginPass: sessionStorage.getItem('loginPass'),
    activePage: '',
}

const mutations = {
    LOGIN (state, {loginName, loginPass}) {
        state.loginName = loginName;
        state.loginPass = md5(loginPass);
        sessionStorage.setItem('loginName', state.loginName);
        sessionStorage.setItem('loginPass', state.loginPass);
    },

    LOGOUT (state, {loginName, loginPass}) {
        state.loginName = '';
        state.loginPass = '';
        sessionStorage.removeItem('loginName');
        sessionStorage.removeItem('loginPass');
    },

    SET_ACTIVE_PAGE (state, name) {
        state.activePage = name
    }

}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
    // plugins: debug? []
})