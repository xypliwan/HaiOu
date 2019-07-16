//物流
import Layout from "@/views/layout/master";
export default [
    {
        path: "/logistics",
        component: Layout,
        children: [
            {
                path: "waybill/waybill-list", //运单列表
                name: "waybillList",
                component: () => import("@/views/logistics/waybill/waybillList/index.vue"),
                meta: {
                    title: "route.logisticsList",
                    name: "waybillList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "waybill/waybill-await", //运单同步
                name: "waybillAwait",
                component: () => import("@/views/logistics/waybill/waybillAwait/index.vue"),
                meta: {
                    title: "route.waybillAwait",
                    name: "waybillAwait",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "sea/sea-price", //海运价格
                name: "seaPrice",
                component: () => import("@/views/logistics/sea/seaPrice/index.vue"),
                meta: {
                    title: "route.channgeList",
                    name: "seaPrice",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "sea/sea-channel", //海运渠道
                name: "seaChannel",
                component: () => import("@/views/logistics/sea/seaChannel/index.vue"),
                meta: {
                    title: "route.seaChannel",
                    name: "seaChannel",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "logistics-channel/logistics-channel-list", //物流渠道列表
                name: "logisticsChannelList",
                component: () => import("@/views/logistics/logisticsChannel/logisticsChannelList/index.vue"),
                meta: {
                    title: "route.logisticsChannelList",
                    name: "logisticsChannelList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "logistics-channel/weight-template", //重量段模板
                name: "weightTemplate",
                component: () => import("@/views/logistics/logisticsChannel/weightTemplate/index.vue"),
                meta: {
                    title: "route.weightTemplate",
                    name: "weightTemplate",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }
]