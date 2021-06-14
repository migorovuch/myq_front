import EventsApiProvider from "../../providers/api/EventsApiProvider";

let eventsApiProvider = new EventsApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        model: null,
        selectedSchedule: null,// for booking form
        selectedSpecialHours: [],// for booking form
    },
    getters: {
        getList: state => state.list,
        getModel: state => state.model,
        getSelectedSchedule: state => state.selectedSchedule,// for booking form
        getSelectedSpecialHours: state => state.selectedSpecialHours,// for booking form
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            eventsApiProvider.getEventsList(
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
        loadOne(context, {filters, successCallback, failCallback}) {
            eventsApiProvider.getEventsList(
                filters,
                (data) => {
                    context.commit('loadOne', data[0]);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        create(context, {data, successCallback, failCallback}) {
            eventsApiProvider.create(data, successCallback, failCallback);
        }
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
        loadOne(state, payload) {
            state.model = payload;
        },
        loadSelectedSchedule(state, payload) {
            state.selectedSchedule = payload;
        },
        loadSelectedSpecialHours(state, payload) {
            state.selectedSpecialHours = payload;
        },
    }
};
