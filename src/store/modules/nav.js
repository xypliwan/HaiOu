const menuNav = {
    state: {
        menuNav: [],            //所有的导航栏列表
        defaultName: '',        //选中的名字
        selectIndex:0,              //当前的index
        selectNav:[]            //当前应用的导航栏
    },
    mutations: {
        "GET_MENULIST": (state, list) => {
            state.menuNav = list
        },
        "SET_DEFAULTNAME": (state, name) => {
            state.defaultName = name
        },
        "SET_SELECTINDEX": (state, index) => {
            state.selectIndex = index
        },
        "SET_SELECTNAV": (state, list) => {
            state.selectNav = list
        },
    },
    actions: {
        "getMenuList": ({ commit }, list) => {
            return commit('GET_MENULIST', list)
        },
        "setDefaultName": ({ commit }, name) => {
            return commit('SET_DEFAULTNAME', name)
        },
        "setSelectIndex": ({ commit }, index) => {
            return commit('SET_SELECTINDEX', index)
        },
        "setSelectNav": ({ commit }, list) => {
            return commit('SET_SELECTNAV', list)
        },
    }
}

export default menuNav;