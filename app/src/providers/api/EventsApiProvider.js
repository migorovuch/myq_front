import ApiProvider from "./ApiProvider";

export default class EventsApiProvider extends ApiProvider {
    getEventsList(filters, successCallback, failCallback) {
        let data = [
            {
                id: 1,
                idSchedule: 1,
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
                idSchedule: 1,
                start: new Date('2021-05-24 14:00'),
                end: new Date('2021-05-24 14:30'),
                title: 'Need to go shopping 2',
                icon: 'shopping_cart', // Custom attribute.
                content: 'Click to see my shopping list',
                contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
                class: 'leisure'
            },
        ];
        successCallback(data);
        if(failCallback) {
            failCallback(data);
        }
    }
}
