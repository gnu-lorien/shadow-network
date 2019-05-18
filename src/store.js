import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    member: {
      id: "",
      attributes: {
        name: ""
      }
    }
  },
  mutations: {
    setCurrentMember(state, member) {
      state.member = member;
    }
  },
  actions: {

  }
})
