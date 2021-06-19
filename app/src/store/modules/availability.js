import AvailabilityApiProvider from "../../providers/api/AvailabilityApiProvider";

let availabilityApiProvider = new AvailabilityApiProvider();

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
            availabilityApiProvider.getScheduleAvailability(
                filter,
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
}
