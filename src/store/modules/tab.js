const nav = {
    state: {
        tabList: [{
            title: "common.home",
            name: "home",
            authentication: true,
            keepAlive: true
        }],
    },
    mutations: {
        "ADD_TABLIST": (state, route) => {
            if (!state.tabList.find(item => item.title === route.title))
                state.tabList.push(route)
        },
        "DELETE_TABLIST": (state, index) => {
            state.tabList.splice(index.start, index.end)
        },
        "DELETEALL_TABKIST": (state) => {
            state.tabList = [{
                title: "common.home",
                name: "home",
                authentication: true,
                keepAlive: true
            }]
        },
    }
}

export default nav;