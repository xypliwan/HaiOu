//物流
import Layout from "@/views/layout/master";
export default [
    {
        path: "/logistics",
        component: Layout,
        children: [
            {
                path: "waybill/waybill-list", //运单列表
                name: "waybill-list",
                component: () => import("@/views/logistics/waybill/waybillList/index.vue"),
                meta: {
                    title: "route.logisticsList",
                    name: "waybill-list",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "waybill/waybill-await", //运单同步
                name: "waybill-await",
                component: () => import("@/views/logistics/waybill/waybillAwait/index.vue"),
                meta: {
                    title: "route.waybillAwait",
                    name: "waybill-await",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "sea/sea-price", //海运价格
                name: "sea-price",
                component: () => import("@/views/logistics/sea/seaPrice/index.vue"),
                meta: {
                    title: "route.channgeList",
                    name: "sea-price",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "sea/sea-channel", //海运渠道
                name: "sea-channel",
                component: () => import("@/views/logistics/sea/seaChannel/index.vue"),
                meta: {
                    title: "route.seaChannel",
                    name: "sea-channel",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "logistics-channel/logistics-channel-list", //物流渠道列表
                name: "logistics-channel-list",
                component: () => import("@/views/logistics/logisticsChannel/logisticsChannelList/index.vue"),
                meta: {
                    title: "route.logisticsChannelList",
                    name: "logistics-channel-list",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "logistics-channel/weight-template", //重量段模板
                name: "weight-template",
                component: () => import("@/views/logistics/logisticsChannel/weightTemplate/index.vue"),
                meta: {
                    title: "route.weightTemplate",
                    name: "weight-template",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }
]