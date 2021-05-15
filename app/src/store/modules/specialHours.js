
export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        getList: state => state.list,
    },
    actions: {
        load(context, idSchedule) {
            let dailyHours = () => {
                return {from: '09:00', to: '18:00'}
            };
            context.commit('load', 
                [
                    {
                        id: 1,
                        idSchedule: idSchedule,
                        ranges: [dailyHours()],
                        startDate: new Date('2021-04-25'),
                        endDate: new Date('2021-05-20'),
                        repeat: 1,
                        repeatDay: 0,
                        repeatDate: new Date('2021-04-29'),
                    },
                    {
                        id: 2,
                        idSchedule: idSchedule,
                        ranges: [
                            {from: '09:00', to: '12:00'},
                            {from: '14:00', to: '18:00'}
                        ],
                        startDate: new Date('2021-04-25'),
                        endDate: new Date('2021-05-20'),
                        repeat: 1,
                        repeatDay: 1,
                        repeatDate: new Date('2021-04-26'),
                    },
                    {
                        id: 3,
                        idSchedule: idSchedule,
                        ranges: [dailyHours()],
                        startDate: new Date('2021-04-25'),
                        endDate: new Date('2021-05-20'),
                        repeat: 1,
                        repeatDay: 3,
                        repeatDate: new Date('2021-04-27'),
                    },
                ]
            );
        }
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
    }
};
