import Vue from 'vue'
import Vuex from 'vuex'
import tab from './modules/tab'
import user from './modules/user'
import theme from './modules/theme'
import nav from './modules/nav'
import getters from './getters'
import actions from './actions'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tab,
    user,
    theme,
    nav
  },
  getters,
  actions
})

