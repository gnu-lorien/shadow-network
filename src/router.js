/* global Parse */
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
            path: '/about',
            name: 'about',
            meta: {
                authorizationOptional: true,
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
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
                    props: true,
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

router.beforeEach((to, from, next) => {
    if (to.meta.authorizationOptional) {
        next();
        return;
    }

    if (!Parse.User.current()) {
        next('/login');
        return;
    }

    if (to.meta.autoLoadMember) {
        return store.dispatch('loadOrUseMember', to.params.memberId)
            .then(() => {
                next();
            })
            .catch(function (e) {
                alert("Failed to load member " + e.message());
            });
    }

    next();
});

export default router;
