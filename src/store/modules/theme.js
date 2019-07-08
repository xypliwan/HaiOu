
import { getLocalStorage } from "_u/localStorage"
import { themeStyle } from "@/config/theme.js"

const theme = {
    state: {
        themeIndex: getLocalStorage("themeindex") || 0,
        themeType: themeStyle[Number(getLocalStorage("themeindex")) - 1] || themeStyle[0],
    },
    mutations: {
        "SET_THEME": (state) => {       //设置主题
            if (getLocalStorage("themeindex")) {
                state.themeIndex = Number(getLocalStorage("themeindex")) - 1
                state.themeType = themeStyle[state.themeIndex]
            }
        },
    }
}

export default theme;