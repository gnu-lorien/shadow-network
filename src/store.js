/* global Parse */
import Vue from 'vue'
import Vuex from 'vuex'
import Member from '@/models/member.js'
import Resource from '@/models/resource.js';

Vue.use(Vuex)

let MemberModule = {
    state: {
        member: {
            id: "",
            name: ""
        },
        resourceIds: []
    },
    mutations: {
        setCurrentMember(state, member) {
            state.member.id = member.id;
            for (const key in member.attributes) {
                Vue.set(state.member, `${key}`, member.get(key));
            }
        },
        addCurrentMemberResourceId(state, resourceId) {
            state.resourceIds = [resourceId].concat(state.resourceIds);
        },
        destroyCurrentMemberResourceId(state, resourceId) {
            state.resourceIds = state.resourceIds.filter((element) => {
                return element !== resourceId;
            });
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
        },
        loadOrUseCurrentMemberResourceIds(context) {
            const q = new Parse.Query(Resource).equalTo("member", {
                __type: 'Pointer',
                className: 'Member',
                objectId: context.state.member.id
            }).select("id");
            return q.find()
                .then((resources) => {
                    context.state.resourceIds = resources.map(resource => resource.id);
                });
        },
    }
};

let ResourcesModule = {
    state: {
        resources: {},
        remoteResources: {}
    },
    mutations: {
        setResource(state, parseResource) {
            state.remoteResources[parseResource.id] = parseResource;
            const resource = {}
            resource.id = parseResource.id;
            for (const key in parseResource.attributes) {
                Vue.set(resource, `${key}`, parseResource.get(key));
            }
            Vue.set(state.resources, resource.id, resource);
        }
    },
    actions: {
        loadOrUseResource(context, resourceId) {
            if (context.state.resources[resourceId] !== undefined) {
                return Promise.resolve(context.state.resources[resourceId]);
            }
            const q = new Parse.Query(Resource);
            return q.get(resourceId)
                .then((resource) => {
                    context.commit('setResource', resource);
                    return Promise.resolve(context.state.resources[resourceId]);
                });
        },
        destroyResource(context, resourceId) {
            return context.dispatch('loadOrUseResource', resourceId)
                .then(() => {
                    // Cache now has the resource we want
                    return context.state.remoteResources[resourceId].destroy();
                })
                .then(() => {
                    delete context.state.remoteResources[resourceId];
                    delete context.state.resources[resourceId];
                    context.commit('destroyCurrentMemberResourceId', resourceId);
                });
        },
        saveResource(context, resourceId) {
            if (context.state.resources[resourceId] === undefined) {
                return Promise.reject({ message: "No loaded resource with id " + resourceId});
            }

            context.state.remoteResources[resourceId].set('name', context.state.resources[resourceId].name);
            return context.state.remoteResources[resourceId].save();
        }
    }
};

export default new Vuex.Store({
    modules: {
        member: MemberModule,
        resources: ResourcesModule
    }
});
