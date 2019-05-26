import Parse from 'parse'
import Vue from 'vue'
import Vuex from 'vuex'
import Member from '@/models/member.js'
import Resource from '@/models/resource.js';
import Component from '@/models/component.js';
import TradeSync from '@/models/tradesync.js';
import TradeOffer from '@/models/tradeoffer.js';

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
        async loadOrUseCurrentMemberResourceIds(context) {
            context.state.resourceIds = await context.dispatch('loadOrUseResourceIds', context.state.member.id);
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
                    return element !== componentId;
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
        async loadOrUseResourceIds(context, memberId) {
            const q = new Parse.Query(Resource).equalTo("member", {
                __type: 'Pointer',
                className: 'Member',
                objectId: memberId
            }).select("id");
            let resources = await q.find();
            let resourceIds = resources.map(resource => resource.id);
            return Promise.resolve(resourceIds);
        },
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
        },
        async createNewResource(context, memberId) {
            const member = await new Parse.Query(Member).get(memberId);
            const memberUser = new Parse.User({id: member.get('owner').id});
            const resource = new Resource();
            const acl = new Parse.ACL();
            acl.setReadAccess(memberUser, true);
            acl.setWriteAccess(memberUser, true);
            acl.setRoleReadAccess('gamemaster', true);
            acl.setRoleWriteAccess('gamemaster', true);
            acl.setPublicReadAccess(false);
            acl.setPublicWriteAccess(false);
            resource.setACL(acl);


            resource.set('member', new Member({id: memberId}));
            resource.set('name', 'Unknown name');
            const remote = await resource.save();
            context.commit('setResource', remote);
            context.commit('addCurrentMemberResourceId', remote.id);
            return Promise.resolve({
                remote: remote,
                local: context.state.resources[remote.id]
            });
        },
        async createNewCurrentMemberResource(context) {
            return context.dispatch('createNewResource', context.rootState.member.member.id);
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
        remoteSyncs: {},
        offers: {},
        remoteOffers: {},
        trades: {},
        remoteTrades: {}
    },
    mutations: {
        setOffer(state, offer) {
            state.remoteOffers[offer.id] = offer;
            Vue.set(state.offers, offer.id, {
                id: offer.id,
                ...offer.attributes
            });
        }
    },
    actions: {
        async loadOrUseTradeIds(context, {memberId, filters}) {
            const q = new Parse.Query(TradeOffer).equalTo("member", {
                __type: 'Pointer',
                className: 'Member',
                objectId: memberId
            }).select("tradesync");
            let offers = await q.find();
            let syncIds = offers.map((offer) => { return offer.get('tradesync').id});
            return Promise.resolve(syncIds);
        },
        async loadOrUseTrade(context, {memberId, syncId}) {
            let sync = await new Parse.Query(TradeSync).get(syncId);
            let me = sync.get('left');
            let them = sync.get('right');
            if (me.get('member').id !== memberId) {
                me = sync.get('right');
                them = sync.get('right');
            }
            context.commit('setOffer', me);
            context.commit('setOffer', them);
            return Promise.resolve({
                sync: sync,
                me: me,
                them: them
            });
        },
        async initiateTradeWith(context, { meId, themId }) {
            let result = await Parse.Cloud.run('initiateTradeWith', { meId, themId });
            context.state.remoteSyncs[result.sync.id] = result.sync;
            context.commit('setOffer', result.me);
            context.commit('setOffer', result.them);
            return Promise.resolve({
                sync: result.sync,
                me: {
                    local: context.state.offers[result.me.id],
                    remote: context.state.remoteOffers[result.me.id]
                },
                them: {
                    local: context.state.offers[result.them.id],
                    remote: context.state.remoteOffers[result.them.id]
                }
            });
        },
        async addResourceToTrade(context, { syncId, resourceId, memberId }) {
            let sync = context.state.remoteSyncs[syncId];
            if (sync === undefined) {
                sync = await new Parse.Query(TradeSync).get(syncId);
            }

            let offer = sync.get('left');
            if (offer.get('member').id !== memberId) {
                offer = sync.get('right');
                if (offer.get('member').id !== memberId) {
                    throw {message: "Member " + memberId + " not involved in selected trade " + syncId}
                }
            }
            let resourceIds = offer.get('resources');
            resourceIds = resourceIds.filter((e) => {
                return e !== resourceId;
            });
            resourceIds = [resourceId].concat(resourceIds);
            offer.set('resources', resourceIds);
            offer.increment('counter');
            try {
                offer = await offer.save();
                context.commit('setOffer', offer);
            } catch (e) {
                offer = await offer.fetch();
                context.commit('setOffer', offer);
                throw e;
            }

            await sync.fetch();

            return Promise.resolve({
                sync: sync,
                me: {
                    local: context.state.offers[offer.id],
                    remote: context.state.remoteOffers[offer.id]
                }
            });
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
        },
        async acceptTradeAs(context, {syncId, memberId}) {
            let sync = context.state.remoteSyncs[syncId];
            if (sync === undefined) {
                throw {message: "Didn't already load TradeSync " + syncId + " no way to validate its contents."};
            }

            let offer = sync.get('left');
            if (offer.get('member').id !== memberId) {
                offer = sync.get('right');
                if (offer.get('member').id !== memberId) {
                    throw {message: "Member " + memberId + " not involved in selected trade " + syncId}
                }
            }

            offer.set('approved', sync.get('counter'));
            await offer.save();
            await sync.fetch();
        },
        async completeTrade(context, params) {
            return Parse.Cloud.run('completeTrade', params);
        },
        async updateTrade(context, {syncId}) {
            let sync = context.state.remoteSyncs[syncId];
            if (sync === undefined) {
                sync = await new Parse.Query(TradeSync).get(syncId);
            } else {
                sync = await sync.fetch();
            }

            return Promise.resolve({
                sync: sync
            });
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

