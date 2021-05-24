export default class AppFormModel {
    model;
    form;
    errors;
    validations; //vue js vuelidate

    constructor(model, form, errors, validations) {
        this.model = model;
        this.form = form;
        this.errors = errors;
        if(!errors) {
            this.resetErrors();
        }
        this.validations = validations;
    }

    resetErrors() {
        this.errors = {formError: '', invalid: false};
    }

    handleResponseErrors(responseData) {
        if ('title' in responseData) {
            this.errors.formError = responseData.title;
        } else if ('message' in responseData) {
            this.errors.formError = responseData.message;
        }
        if ('errors' in responseData) {
            for (let error of responseData.errors) {
                if (error.source in this.form) {
                    this.errors[error.source] = error.title;
                }
            }
        }
    }
}
