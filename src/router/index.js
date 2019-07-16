import Vue from "vue";
import Router from "vue-router";
import { getLocalStorage } from '_u/localStorage';

import common from './common'           //公共
import tool from './tool'               //研发工具
import demand from './demand'           //需求
import client from './client'           //客户管理
import system from './system'           //系统
import logistics from './logistics'     //物流

Vue.use(Router);


const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        ...common,
        ...demand,
        ...tool,
        ...client,
        ...system,
        ...logistics,
        {
            path: "*",
            name: "404",
            component: () => import("@/views/404/index.vue"),
            meta: {
                authentication: true,
                keepAlive: true
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.authentication && !getLocalStorage('userinfo')) {
        next({ path: '/entran/login' })
    } else {
        next()
    }

    
})

export default router;