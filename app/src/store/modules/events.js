
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
        load(context, idSchedule) {
            context.commit('load', [
                {
                    id: 1,
                    idSchedule: idSchedule,
                    start: new Date('2021-05-18 16:00'),
                    end: new Date('2021-05-18 17:30'),
                    title: 'Need to go shopping',
                    icon: 'shopping_cart', // Custom attribute.
                    content: 'Click to see my shopping list',
                    contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
                    class: 'leisure'
                },
                {
                    id: 2,
                    idSchedule: idSchedule,
                    start: new Date('2021-05-17 14:00'),
                    end: new Date('2021-05-17 14:30'),
                    title: 'Need to go shopping 2',
                    icon: 'shopping_cart', // Custom attribute.
                    content: 'Click to see my shopping list',
                    contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
                    class: 'leisure'
                },
            ]);
        },
        loadOne(context, id) {
            context.commit('loadOne',  {
                id: id,
                idSchedule: 1,
                start: new Date('2021-05-14 14:00'),
                end: new Date('2021-05-14 14:30'),
                title: 'Need to go shopping 2',
                icon: 'shopping_cart', // Custom attribute.
                content: 'Click to see my shopping list',
                contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
                class: 'leisure'
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
