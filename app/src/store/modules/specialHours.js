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
        load(context, {idSchedule, successCallback, failCallback}) {
            specialHoursApiProvider.getSpecialHours(
                idSchedule,
                (data) => {
                    context.commit('load', data);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        }
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
    }
};
