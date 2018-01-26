import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'


const state = {

}


export default new Vuex.Store({
    state,
    actions,
    mutations,
    // modules： {

    // },
    strict: debug,
    // plugins: debug? []
})