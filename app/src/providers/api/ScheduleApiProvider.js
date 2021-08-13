import ApiProvider from "./ApiProvider";

export default class ScheduleApiProvider extends ApiProvider {
    getMyScheduleList(filter, successCallback, failCallback) {
        this.get(
            'api/schedule/search/my',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    getScheduleList(filter, successCallback, failCallback) {
        this.get(
            'api/schedule/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    update(id, data, successCallback, failCallback) {
        this.put('api/schedule/' + id, data, successCallback, failCallback);
    }

    create(data, successCallback, failCallback) {
        this.post('api/schedule/', data, successCallback, failCallback);
    }
}
