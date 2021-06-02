import ScheduleApiProvider from "../../providers/api/ScheduleApiProvider";
let scheduleApiProvider = new ScheduleApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        model: null
    },
    getters: {
        getList: state => state.list,
        getModel: state => state.model,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            scheduleApiProvider.getScheduleList(
                filter,
                (data) => {
                    context.commit('load', data);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        loadOne(context, {id, successCallback, failCallback}) {
            let filter = {id: id};
            scheduleApiProvider.getScheduleList(
                filter,
                (data) => {
                    if (data.length) {
                        context.commit('loadOne', data[0]);
                        if (successCallback) {
                            successCallback(data[0]);
                        }
                    }
                },
                failCallback
            );
        },
        update(context, {id, data, successCallback, failCallback}) {
            scheduleApiProvider.update(
                id,
                data,
                (callbackData) => {
                    if (Object.keys(callbackData).length === 0) {
                        context.commit('loadOne', callbackData);
                    }
                    if (successCallback) {
                        successCallback(callbackData);
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
        }
    }
};
