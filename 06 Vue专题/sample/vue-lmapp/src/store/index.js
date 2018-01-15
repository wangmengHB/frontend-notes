import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './modules/userInfo'
// import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
	// state,
	getters,
	actions,
	// mutations,
	modules: {
		userInfo
	},
})