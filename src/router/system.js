// 系统
import Layout from "@/views/layout/master";


export default [
    {
        path: "/system",
        component: Layout,
        children: [
            {
                path: "user/list", //用户列表
                name: "userList",
                component: () => import("@/views/system/userManage/index.vue"),
                meta: {
                    title: "route.userList",
                    name: "userList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "user-center", //个人中心
                name: "userCenter",
                component: () => import("@/views/system/userCenter/index.vue"),
                meta: {
                    title: "route.userCenter",
                    name: "userCenter",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "contract/contract-list", //合同列表
                name: "contractList",
                component: () => import("@/views/system/contract/contractList/index.vue"),
                meta: {
                    title: "route.contractList",
                    name: "contractList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "contract/contract-template", //合同模板
                name: "contractTemplate",
                component: () => import("@/views/system/contract/contractTemplate/index.vue"),
                meta: {
                    title: "route.contractTemplate",
                    name: "contractTemplate",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "system-manage/cache", //缓存管理
                name: "cache",
                component: () => import("@/views/system/systemManage/cache/index.vue"),
                meta: {
                    title: "route.cache",
                    name: "cache",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "system-manage/config", //系统配置
                name: "config",
                component: () => import("@/views/system/systemManage/config/index.vue"),
                meta: {
                    titles: "route.systemConfig",
                    name: "config",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "system-manage/charge-set", //收费设置
                name: "chargeSet",
                component: () => import("@/views/system/systemManage/chargeSet/index.vue"),
                meta: {
                    title: "route.chargeSet",
                    name: "chargeSet",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "label/label-management", //标签列表
                name: "labelManagement",
                component: () => import("@/views/system/label/labelManagement/index.vue"),
                meta: {
                    title: "route.labelManagement",
                    name: "labelManagement",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "label/label-list", //标签管理
                name: "labelList",
                component: () => import("@/views/system/label/labelList/index.vue"),
                meta: {
                    title: "route.labelList",
                    name: "labelList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "label/print", //打印设置
                name: "print",
                component: () => import("@/views/system/label/print/index.vue"),
                meta: {
                    title: "route.print",
                    name: "print",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    },
]