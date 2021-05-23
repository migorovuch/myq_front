import ApiProvider from "./ApiProvider";

export default class AccountApiProvider extends ApiProvider {

    login(data, successCallback, failCallback) {
        this.post(
            'login_check',
            data,
            data => {
                this.setToken(data.token);
                successCallback(data)
            },
            failCallback
        );
    }

    registration(data, successCallback, failCallback) {
        this.post('registration', data, successCallback, failCallback);
    }

    requestPassword(data, successCallback, failCallback) {
        this.post('reset-password/request', data, successCallback, failCallback);
    }

    resetPassword(formModel, successCallback, failCallback) {
        this.post('reset-password/reset', formModel.model, successCallback, failCallback);
    }

    logout() {
        localStorage.removeItem('userToken');
    }
}
