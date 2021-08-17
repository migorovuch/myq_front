
export default {
    namespaced: true,
    state: {
        sidebarShow: 'responsive',
        sidebarMinimize: false,
        breadcrumbItems: []
    },
    getters: {
        getSidebarShow: state => state.sidebarShow,
        getSidebarMinimize: state => state.sidebarMinimize,
        getBreadcrumbItems: state => state.breadcrumbItems,
    },
    actions: {
    },
    mutations: {
        toggleSidebarDesktop (state) {
            const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
            state.sidebarShow = sidebarOpened ? false : 'responsive';
        },
        toggleSidebarMobile (state) {
            const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
            state.sidebarShow = sidebarClosed ? true : 'responsive'
        },
        setSidebarShow(state, value) {
            state.sidebarShow = value;
        },
        setSidebarMinimize(state, value) {
            state.sidebarMinimize = value;
        },
        setBreadcrumbItems(state, value) {
            state.breadcrumbItems = value;
        },
    }
}
