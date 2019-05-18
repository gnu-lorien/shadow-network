import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        member: {
            id: "",
            name: ""
        }
    },
    mutations: {
        setCurrentMember(state, member) {
            state.member.id = member.id;
            for (const key in member.attributes) {
                Vue.set(state.member, `${key}`, member.get(key));
            }
        }
    },
    actions: {}
})
