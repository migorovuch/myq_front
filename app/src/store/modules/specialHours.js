import SpecialHoursApiProvider from "../../providers/api/SpecialHoursApiProvider";

let specialHoursApiProvider = new SpecialHoursApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        getList: state => state.list,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            specialHoursApiProvider.getSpecialHours(
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
        saveList(context, {data, successCallback, failCallback}) {
            specialHoursApiProvider.saveList(
                data,
                (data) => {
                    context.commit('load', data);
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
    }
};
