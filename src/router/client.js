//客户管理
import Layout from "@/views/layout/master";

export default [
    {
        path: "/client",
        component: Layout,
        children: [
            {
                path: "customer/list",        //客户列表
                name: "company-manage",
                component: () => import("@/views/client/companyManage/index.vue"),
                meta: {
                    title: "route.customerList",
                    name: "company-manage",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }
]


