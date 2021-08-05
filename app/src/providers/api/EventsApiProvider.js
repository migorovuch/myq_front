import ApiProvider from "./ApiProvider";

export default class EventsApiProvider extends ApiProvider {
    getEventsList(filter, successCallback, failCallback) {
        this.get(
            'api/bookings/search',
            {filter: filter},
            successCallback,
            failCallback
        );
    }

    getMyEventsList(filter, successCallback, failCallback) {
        this.get(
            'api/bookings/my',
            {filter: filter},
            successCallback,
            failCallback
        );
    }

    create(data, successCallback, failCallback) {
        this.post('api/bookings/', data, successCallback, failCallback);
    }

    update(id, data, successCallback, failCallback) {
        this.patch('api/bookings/' + id, data, successCallback, failCallback);
    }
}
