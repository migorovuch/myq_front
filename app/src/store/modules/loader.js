export default {
    namespaced: true,
    state: {
        loading: false,
    },
    getters: {
        isLoading: state => state.loading,
    },
    mutations: {
        startLoading(state) {
            console.log('startLoading');
            state.loading = true;
        },
        endLoading(state) {
            console.log('endLoading');
            state.loading = false;
        },
    }
};
