import { getLocalStorage, removeLocalStorage } from "_u/localStorage"
const user = {
    state: {
        userInfo: getLocalStorage('userinfo') || {}
    },
    mutations: {
        "SET_USERINFO": (state, user) => {
            state.userInfo = user
        },
        "CLEAR_USERINFO": (state) => {
            state.userInfo = {}
            removeLocalStorage("userinfo")
        },
    }
}

export default user;