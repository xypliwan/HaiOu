import Layout from "@/views/layout/master";

//公共
export default [
    {
        path: "/home",
        component: Layout,
        children: [
            {
                path: "/home",        //客户列表
                name: "home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "common.home",
                    name: "home",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    },
    {
        path: "/entran",
        component: () => import("@/views/entran/index.vue"),
        redirect: "/entran/login",
        meta: {
            authentication: false,
            keepAlive: false
        },
        children: [{
            path: "login",
            component: () => import("@/views/entran/Login.vue"),
            meta: {
                authentication: false,
                keepAlive: false
            }
        },
        {
            path: "/regist",
            name: 'regist',
            component: () => import("@/views/entran/Regist.vue"),
            meta: {
                authentication: false,
                keepAlive: false
            }
        },

        ]

    }

]