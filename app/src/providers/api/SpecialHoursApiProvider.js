import ApiProvider from "./ApiProvider";

export default class SpecialHoursApiProvider extends ApiProvider {
    getSpecialHours(filter, successCallback, failCallback) {
        this.get(
            'special-hours/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    saveList(data, successCallback, failCallback) {
        this.put(
            'special-hours/update-list',
            data,
            successCallback,
            failCallback
        );
    }
}
