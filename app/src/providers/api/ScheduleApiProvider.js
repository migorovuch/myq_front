import ApiProvider from "./ApiProvider";

export default class ScheduleApiProvider extends ApiProvider {
    getMyScheduleList(filter, successCallback, failCallback) {
        this.get(
            'schedule/search/my',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    getScheduleList(filter, successCallback, failCallback) {
        this.get(
            'schedule/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    update(id, data, successCallback, failCallback) {
        this.put('schedule/' + id, data, successCallback, failCallback);
    }
}
