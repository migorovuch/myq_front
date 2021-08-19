import ApiProvider from "./ApiProvider";

export default class AccountApiProvider extends ApiProvider {

    login(data, successCallback, failCallback) {
        this.post(
            'api/login_check',
            data,
            successCallback,
            failCallback
        );
    }

    registration(data, successCallback, failCallback) {
        this.post('api/registration', data, successCallback, failCallback);
    }

    requestPassword(data, successCallback, failCallback) {
        this.post('api/reset-password/request', data, successCallback, failCallback);
    }

    resetPassword(data, successCallback, failCallback) {
        this.post('api/reset-password/reset', data, successCallback, failCallback);
    }

    changeAccount(data, successCallback, failCallback) {
        this.put('api/account/', data, successCallback, failCallback);
    }

    emailConfirmAsync(id, token) {
        return this.asyncRequest('api/approve-email', {
            'method': 'POST',
            'body': {
                id,
                token
            }
        });
    }
}
