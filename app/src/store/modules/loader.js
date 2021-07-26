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
            state.loading = true;
        },
        endLoading(state) {
            state.loading = false;
        },
    }
};
