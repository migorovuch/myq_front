import ApiProvider from "./ApiProvider";

export default class AccountApiProvider extends ApiProvider {

    login(data, successCallback, failCallback) {
        this.post(
            'login_check',
            data,
            successCallback,
            failCallback
        );
    }

    registration(data, successCallback, failCallback) {
        this.post('registration', data, successCallback, failCallback);
    }

    requestPassword(data, successCallback, failCallback) {
        this.post('reset-password/request', data, successCallback, failCallback);
    }

    resetPassword(data, successCallback, failCallback) {
        this.post('reset-password/reset', data, successCallback, failCallback);
    }

    changeAccount(data, successCallback, failCallback) {
        this.patch('account/', data, successCallback, failCallback);
    }

    emailConfirmAsync(id, token) {
        return this.asyncRequest('approve-email', {
            'method': 'POST',
            'body': {
                id,
                token
            }
        });
    }
}
