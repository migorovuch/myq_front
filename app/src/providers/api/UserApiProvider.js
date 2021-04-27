import ApiProvider from "./ApiProvider";

export default class UserApiProvider extends ApiProvider {

    login(formModel, successCallback) {
        if(!formModel.errors.invalid) {
            this.post(
                'login',
                formModel.model,
                data => {
                    this.setToken(data.token);
                    successCallback(data)
                },
                data => {
                    formModel.handleResponseErrors(data);
                }
            );
        }
    }

    registration(formModel, successCallback) {
        if(!formModel.errors.invalid) {
            this.post(
                'registration',
                Object.assign(formModel.model,{roles: ["ROLE_USER"]}),
                successCallback,
                data => {
                    formModel.handleResponseErrors(data);
                }
            );
        }
    }

    requestPassword(formModel, successCallback) {
        if(!formModel.errors.invalid) {
            this.post(
                'reset-password/request',
                formModel.model,
                successCallback,
                data => {
                    formModel.handleResponseErrors(data);
                }
            );
        }
    }

    resetPassword(formModel, successCallback) {
        if(!formModel.errors.invalid) {
            this.post(
                'reset-password/reset',
                formModel.model,
                successCallback,
                data => {
                    formModel.handleResponseErrors(data);
                }
            );
        }
    }

    logout() {
        this.setToken(null);
    }
}
