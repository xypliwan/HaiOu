import Layout from "@/views/layout/master";

export default [
    {
        path: "",
        component: Layout,
        children: [
            {
                path: "/menu-list", //菜单管理
                name: "menuList",
                component: () => import("@/views/devtool/menuList/index.vue"),
                meta: {
                    title: "菜单列表",
                    name: "menuList",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "/lang-list", //语言包管理
                name: "langList",
                component: () => import("@/views/devtool/langList/index.vue"),
                meta: {
                    title: "语言包列表",
                    name: "langList",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }




]