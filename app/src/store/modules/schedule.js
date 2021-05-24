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
        load(context, {idCompany, successCallback, failCallback}) {
            scheduleApiProvider.getScheduleList(
                idCompany,
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
            scheduleApiProvider.getSchedule(
                id,
                (data) => {
                    context.commit('loadOne', data);
                    if (successCallback) {
                        successCallback(data);
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
