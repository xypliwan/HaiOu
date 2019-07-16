const nav = {
    state: {
        tabList: [{
            title: "common.home",
            name: "home",
            authentication: true,
            keepAlive: true
        }],
        cachedViews: ['home']
    },
    mutations: {
        "ADD_TABLIST": (state, route) => {
            if (!state.tabList.find(item => item.title === route.title)) {
                state.tabList.push(route);
                state.cachedViews.push(route.name)
            }
        },
        "DELETE_TABLIST": (state, index) => {
            state.tabList.splice(index.start, index.end)
            state.cachedViews.splice(index.start, index.end)
        },
        "DELETEALL_TABKIST": (state) => {
            state.tabList = [{
                title: "common.home",
                name: "home",
                authentication: true,
                keepAlive: true
            }]
            state.cachedViews = ['home']
        }

    }
}

export default nav;