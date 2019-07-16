//需求管理
import Layout from "@/views/layout/master";

export default [
    {
        path: "/demand",
        component: Layout,
        children: [
            {
                path: "demand/list",        //需求管理
                name: "orderManage",
                component: () => import("@/views/demand/orderManage/index.vue"),
                meta: {
                    title: "route.demandList",
                    name: "orderManage",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }
]