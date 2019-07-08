const actions = {
    "addTablist": ({
        commit
    }, route) => {
        return commit('ADD_TABLIST', route)
    },
    "deleteTablist": ({
        commit
    }, index) => {
        return commit('DELETE_TABLIST', index)
    },
    "deleteAllTablist": ({
        commit
    }) => {
        return commit('DELETEALL_TABKIST')
    },
    "setUserInfo": ({
        commit
    }, user) => {
        return commit('SET_USERINFO', user)
    },
    "clearUserInfo": ({
        commit
    }) => {
        return commit('CLEAR_USERINFO')
    },
    "setTheme": ({ commit }) => {        //设置主题
        return commit('SET_THEME')
    },

}

export default actions;