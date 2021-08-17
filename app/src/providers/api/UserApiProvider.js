import ApiProvider from "./ApiProvider";

export default class UserApiProvider extends ApiProvider {

    getUsersList(filter, successCallback, failCallback) {
        this.get(
            'api/users/search',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    update(id, data, successCallback, failCallback) {
        this.put('api/users/' + id, data, successCallback, failCallback);
    }
}
