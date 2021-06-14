import ApiProvider from "./ApiProvider";

export default class EventsApiProvider extends ApiProvider {
    getEventsList(filter, successCallback, failCallback) {
        this.get(
            'bookings/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    create(data,successCallback, failCallback) {
        this.post('bookings/', data, successCallback, failCallback);
    }
}
