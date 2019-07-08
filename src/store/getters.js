const getters = {
    tabList: state => state.tab.tabList,
    userInfo: state => state.user.userInfo,
    themeType:state => state.theme.themeType,
    menuNav:state => state.nav.menuNav,
    defaultName:state => state.nav.defaultName,
    selectIndex:state => state.nav.selectIndex,
    selectNav:state => state.nav.selectNav
    
}

export default getters;