import Parse from 'parse'
import Vue from 'vue'
import Vuex from 'vuex'
import Member from '@/models/member.js'
import Resource from '@/models/resource.js';
import Component from '@/models/component.js';
import Trade from '@/models/trade.js';

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
        async updateAndSaveCurrentMember(context, newAttributes) {
            const q = new Parse.Query(Member);
            let member = await q.get(context.state.member.id);
            member.set(newAttributes);
            member = await member.save();
            context.commit('setCurrentMember', member);
            return Promise.resolve(member);
        }
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
        },
        destroyCurrentMemberResourceComponentId(state, { resourceId, componentId }) {
            if (state.resources[resourceId] !== undefined) {
                let n = state.resources[resourceId].componentIds.filter((element) => {
                    return element != componentId;
                });
                Vue.set(state.resources[resourceId], 'componentIds', n);
            }
        },
        addCurrentMemberResourceComponentId(state, { resourceId, componentId }) {
            if (state.resources[resourceId] !== undefined) {
                state.resources[resourceId].componentIds = [componentId].concat(state.resources[resourceId].componentIds);
            }
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
        loadOrUseResourceComponents(context, resourceId) {
            return context.dispatch('loadOrUseResource', resourceId)
                .then(() => {
                    return context.dispatch('loadOrUseComponentsForResource', resourceId);
                })
                .then((components) => {
                    Vue.set(context.state.resources[resourceId], 'componentIds', components.map(c => c.id));
                })
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

let ComponentsModule = {
    state: {
        components: {},
        remoteComponents: {}
    },
    mutations: {
        setComponent(state, parseComponent) {
            state.remoteComponents[parseComponent.id] = parseComponent;
            const component = {}
            component.id = parseComponent.id;
            for (const key in parseComponent.attributes) {
                Vue.set(component, `${key}`, parseComponent.get(key));
            }
            Vue.set(state.components, component.id, component);
        }
    },
    actions: {
        loadOrUseComponent(context, componentId) {
            if (context.state.components[componentId] !== undefined) {
                return Promise.resolve(context.state.components[componentId]);
            }
            const q = new Parse.Query(Component);
            return q.get(componentId)
                .then((component) => {
                    context.commit('setComponent', component);
                    return Promise.resolve(context.state.components[componentId]);
                });
        },
        loadOrUseComponentsForResource(context, resourceId) {
            const q = new Parse.Query(Component).equalTo("resource", {
                __type: 'Pointer',
                className: 'Resource',
                objectId: resourceId
            });
            return q.find()
                .then((parseComponents) => {
                    for (const parseComponent of parseComponents)
                    {
                        context.commit('setComponent', parseComponent);
                    }
                    const components = parseComponents.map(({id}) => {
                        return context.state.components[id];
                    });
                    return Promise.resolve(components);
                });
        },
        destroyComponent(context, componentId) {
            let resourceId;
            return context.dispatch('loadOrUseComponent', componentId)
                .then(() => {
                    // Cache now has the resource we want
                    resourceId = context.state.remoteComponents[componentId].get('resource').id;
                    return context.state.remoteComponents[componentId].destroy();
                })
                .then(() => {
                    delete context.state.remoteComponents[componentId];
                    delete context.state.components[componentId];
                    context.commit('destroyCurrentMemberResourceComponentId', { resourceId: resourceId, componentId: componentId});
                });
        },
        saveComponent(context, {componentId, newData}) {
            if (context.state.components[componentId] === undefined) {
                return Promise.reject({ message: "No loaded component with id " + componentId});
            }

            context.state.remoteComponents[componentId].set(newData);
            return context.state.remoteComponents[componentId].save()
                .then(component => {
                    return context.commit('setComponent', component);
                });
        }
    }
};

let TradingModule = {
    state: {
        trades: {},
        remoteTrades: {}
    },
    mutations: {

    },
    actions: {
        async initiateTradeWith(context, { meId, themId }) {
            let me = await new Parse.Query(Member).get(meId);
            let them = await new Parse.Query(Member).get(themId);
            let trade = new Trade({
                meId: me,
                themId: them,
                meResources: [],
                themResources: [],
                counter: 1
            });
            trade = await trade.save();
            Vue.set(context.state.trades, trade.id, {
                id: trade.id,
                ...trade.attributes
            });
            context.state.remoteTrades[trade.id] = trade;
            return Promise.resolve([
                context.state.trades[trade.id],
                context.state.remoteTrades[trade.id]
            ]);
        },
        async addResourceToTrade(context, { tradeId, resourceId, memberId }) {
            const trade = context.state.trades[tradeId];
            if (trade === undefined) {
                return Promise.reject({message: "No trade matching " + tradeId});
            }

            let resourceIds = trade.meResources;
            let resourceKey = "meResources";
            if (memberId !== trade.meId.id) {
                resourceIds = trade.themResources;
                resourceKey = "themResources";
            }
            resourceIds = resourceIds.filter((e) => {
                return e !== resourceId;
            });
            resourceIds = [resourceId].concat(resourceIds);
            Vue.set(context.state.trades[tradeId], resourceKey, resourceIds);
            context.state.remoteTrades[tradeId].set(resourceKey, resourceIds);

            const result = await context.dispatch('attemptUpdate', context.state.remoteTrades[tradeId]);
            if (result[0] === false) {
                return context.dispatch('addResourceToTrade', {
                    tradeId: tradeId,
                    resourceId: resourceId,
                    memberId: memberId
                });
            }
            return Promise.resolve([
                context.state.trades[result.id],
                context.state.remoteTrades[result.id]
            ]);
        },
        async attemptUpdate(context, inTrade) {
            let currentCount = inTrade.get('counter');
            inTrade.increment('counter');
            let newTrade = await inTrade.save();
            context.state.remoteTrades[newTrade.id] = newTrade;
            Vue.set(context.state.trades, newTrade.id, {
                id: newTrade.id,
                ...newTrade.attributes
            });
            if (currentCount + 1 !== newTrade.get('counter')) {
                return Promise.resolve([
                    false,
                    false
                ]);
            }
            return Promise.resolve(newTrade);
        }
    }
};

export default new Vuex.Store({
    modules: {
        member: MemberModule,
        resources: ResourcesModule,
        components: ComponentsModule,
        trading: TradingModule
    }
});
