import ApiProvider from "./ApiProvider";

export default class ScheduleApiProvider extends ApiProvider {
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
