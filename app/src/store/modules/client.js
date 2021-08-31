import ClientApiProvider from "../../providers/api/ClientApiProvider";

let clientApiProvider = new ClientApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        listTotal: 0,
        model: null,
    },
    getters: {
        getList: state => state.list,
        getListTotal: state => state.listTotal,
        getModel: state => state.model,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            clientApiProvider.getClientsList(
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
        loadOne(context, {filters, successCallback, failCallback}) {
            clientApiProvider.getClientsList(
                filters,
                (data) => {
                    context.commit('loadOne', data.data[0]);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        change(context, {id, data, successCallback, failCallback}) {
            clientApiProvider.change(id, data, successCallback, failCallback);
        },
        updateClients(context, {data, successCallback, failCallback}) {
            clientApiProvider.updateClients({'clients': data}, successCallback, failCallback);
        }
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
        }
    }
};
