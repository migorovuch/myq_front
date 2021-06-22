import ApiProvider from "./ApiProvider";

export default class EventsApiProvider extends ApiProvider {
    getEventsList(filter, successCallback, failCallback) {
        this.get(
            'bookings/search',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    getMyEventsList(filter, successCallback, failCallback) {
        this.get(
            'bookings/my',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    create(data,successCallback, failCallback) {
        this.post('bookings/', data, successCallback, failCallback);
    }
}
