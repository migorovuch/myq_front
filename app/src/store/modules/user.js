import UserApiProvider from "../../providers/api/UserApiProvider";

let userApiProvider = new UserApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        listTotal: 0,
        model: null
    },
    getters: {
        getList: state => state.list,
        getListTotal: state => state.listTotal,
        getModel: state => state.model,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            userApiProvider.getUsersList(
                filter,
                (data) => {
                    context.commit('load', data.data);
                    context.commit('setListTotal', data.total);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        loadOne(context, {id, successCallback, failCallback}) {
            userApiProvider.getUsersList(
                {id: id},
                (data) => {
                    if (data.data.length) {
                        context.commit('loadOne', data.data[0]);
                        if (successCallback) {
                            successCallback(data);
                        }
                    }
                },
                failCallback
            );
        },
        update(context, {id, data, successCallback, failCallback}) {
            userApiProvider.update(
                id,
                data,
                (companyData) => {
                    if (Object.keys(companyData).length) {
                        context.commit('loadOne', companyData);
                    }
                    if (successCallback) {
                        successCallback(companyData);
                    }
                },
                failCallback
            );
        },
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
        loadOne(state, payload) {
            state.model = payload;
        },
        setListTotal(state, payload) {
            state.listTotal = payload;
        },
    }
};
