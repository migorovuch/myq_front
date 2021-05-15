
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
        load(context, idCompany) {
            context.commit('load', [idCompany]);
        },
        loadOne(context, id) {
            context.commit('loadOne',  {
                id: id,
                name: 'First Schedule',
                enabled: false, // available for booking
                available: true, // Always available for booking or only in specialHours
                bookingDuration: 0,// seconds, 0 - manual setting for each booking
                minBookingTime: 0,// available only in case bookingDuration==0
                maxBookingTime: 0,// available only in case bookingDuration==0, 0 - no limit
                description: '',
            })
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
