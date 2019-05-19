/* global Parse */
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Members from './views/Members.vue'
import Resources from './views/Resources.vue'
import MemberLanding from './views/MemberLanding.vue'
import MemberResources from './views/MemberResources.vue'

Vue.use(Router)

const router =  new Router({
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
            component: MemberLanding,
            children: [
                {
                    path: 'resources',
                    name: 'memberResources',
                    component: MemberResources
                }
            ]
        },
        {
            path: '/resources',
            name: 'resources',
            component: Resources
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
    } else {
        next();
    }
});

export default router;
