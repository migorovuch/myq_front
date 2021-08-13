import ApiProvider from "./ApiProvider";

export default class SpecialHoursApiProvider extends ApiProvider {
    getSpecialHours(filter, successCallback, failCallback) {
        this.get(
            'api/special-hours/search',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    saveList(data, successCallback, failCallback) {
        this.put(
            'api/special-hours/update-list',
            data,
            successCallback,
            failCallback
        );
    }
}
