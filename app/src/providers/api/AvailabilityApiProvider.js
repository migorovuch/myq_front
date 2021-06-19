

import ApiProvider from "./ApiProvider";
import store from "../../store/store";

export default class AvailabilityApiProvider extends ApiProvider {


    getScheduleAvailability(filter, successCallback, failCallback) {
        this.get(
            'availability/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }
}
