import Layout from "@/views/layout/master";

export default [
    {
        path: "",
        component: Layout,
        children: [
            {
                path: "/menu-list", //菜单管理
                name: "menu-list",
                component: () => import("@/views/devtool/menuList/index.vue"),
                meta: {
                    title: "菜单列表",
                    name: "menu-list",
                    authentication: true,
                    keepAlive: true
                }
            },
            {
                path: "/lang-list", //语言包管理
                name: "lang-list",
                component: () => import("@/views/devtool/langList/index.vue"),
                meta: {
                    title: "语言包列表",
                    name: "lang-list",
                    authentication: true,
                    keepAlive: true
                }
            },
        ]
    }




]