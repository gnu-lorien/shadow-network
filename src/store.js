/* global Parse */
import Vue from 'vue'
import Vuex from 'vuex'
import Member from '@/models/member.js'

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
    actions: {
        loadOrUseMember(context, memberId) {
            if (context.state.member.id === memberId) {
                return Promise.resolve();
            }
            const q = new Parse.Query(Member);
            return q.get(memberId)
                .then((member) => {
                    context.commit('setCurrentMember', member);
                });
        }
    }
})
