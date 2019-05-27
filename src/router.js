import Parse from 'parse';
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Members from './views/Members.vue'
import MemberLanding from './views/member/MemberLanding.vue'
import MemberResources from './views/member/MemberResources.vue'
import ResourceEdit from './views/ResourceEdit.vue'
import ComponentEdit from './views/ComponentEdit.vue'
import MemberTrading from './views/member/Trading.vue'
import MemberVault from './views/member/Vault.vue'
import MemberProfile from './views/member/Profile.vue'
import MemberTradeLanding from './views/member/TradeLanding.vue'
import GameMasterLanding from './views/gamemaster/Landing.vue'
import GameMasterTransferMembers from './views/gamemaster/TransferMembers.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                authorizationOptional: true,
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                authorizationOptional: true,
            }
        },
        {
            path: '/gamemaster',
            name: 'gamemaster',
            component: GameMasterLanding,
            meta: {
                requiredRoles: ['gamemaster']
            },
            children: [
                {
                    path: '/transfer',
                    name: 'gamemasterTransferMembers',
                    component: GameMasterTransferMembers,
                    meta: {
                        requiredRoles: ['gamemaster']
                    },
                }
            ]
        },
        {
            path: '/members',
            name: 'members',
            component: Members
        },
        {
            path: '/member/:memberId',
            name: 'memberLanding',
            props: true,
            component: MemberLanding,
            meta: {
                autoLoadMember: true,
            },
            children: [
                {
                    path: 'resources',
                    name: 'memberResources',
                    props: (route) => ({
                        memberId: route.params.memberId,
                        page: route.query.page
                    }),
                    component: MemberResources,
                    meta: {
                        autoLoadMember: true,
                    }
                },
                {
                    path: 'resource/:resourceId',
                    name: 'memberResourceEdit',
                    props: true,
                    component: ResourceEdit,
                    meta: {
                        autoLoadMember: true
                    },
                    children: [
                        {
                            path: 'component/:componentId',
                            name: 'memberResourceComponentEdit',
                            props: true,
                            component: ComponentEdit,
                            meta: {
                                autoLoadMember: true
                            }
                        }
                    ]
                },
                {
                    path: 'trading',
                    name: 'memberTrading',
                    props: true,
                    component: MemberTrading,
                    meta: {
                        autoLoadMember: true,
                    },
                },
                {
                    path: 'trade/:syncId',
                    name: 'memberTradeLanding',
                    props: true,
                    component: MemberTradeLanding,
                    meta: {
                        autoLoadMember: true
                    }
                },
                {
                    path: 'profile',
                    name: 'memberProfile',
                    props: true,
                    component: MemberProfile,
                    meta: {
                        autoLoadMember: true,
                    }
                },
                {
                    path: 'vault',
                    name: 'memberVault',
                    props: true,
                    component: MemberVault,
                    meta: {
                        autoLoadMember: true,
                    }
                }

            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    store.commit('setUser', Parse.User.current());
    let roles = await store.dispatch('updateUserRoles');

    if (to.meta.authorizationOptional) {
        next();
        return;
    }

    if (!Parse.User.current()) {
        next('/login');
        return;
    }

    if (to.meta.autoLoadMember) {
        try {
            await store.dispatch('loadOrUseCurrentMember', to.params.memberId)
            next();
        } catch(e) {
            alert("Failed to load member " + e.message());
        }
    }

    if (to.meta.requiredRoles) {
        if (roles === undefined) {
            alert("Don't have required roles " + to.meta.requiredRoles);
            next(false);
            return;
        }
        for (let requiredRole of to.meta.requiredRoles) {
            for (let role of roles) {
                if (requiredRole === role) {
                    next();
                    return;
                }
            }
        }
        alert("Don't have required roles " + to.meta.requiredRoles);
        next(false);
        return;
    }

    next();
});

export default router;
