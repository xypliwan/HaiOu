//需求管理
import Layout from "@/views/layout/master";

export default [
    {
        path: "/demand",
        component: Layout,
        children: [
            {
                path: "demand/list",        //需求管理
                name: "order-manage",
                component: () => import("@/views/demand/orderManage/index.vue"),
                meta: {
                    title: "route.demandList",
                    name: "order-manage",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }
]