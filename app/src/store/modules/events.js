import EventsApiProvider from "../../providers/api/EventsApiProvider";

let eventsApiProvider = new EventsApiProvider();

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
            eventsApiProvider.getEventsList(
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
        loadMy(context, {filter, successCallback, failCallback}) {
            eventsApiProvider.getMyEventsList(
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
            eventsApiProvider.getEventsList(
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
        create(context, {data, successCallback, failCallback}) {
            eventsApiProvider.create(data, successCallback, failCallback);
        },
        update(context, {id, data, successCallback, failCallback}) {
            eventsApiProvider.update(id, data, successCallback, failCallback);
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
