export default class AppFormModel {
    model;
    form;
    errors;
    validations; //vue js vuelidate

    constructor(model, form, errors, validations) {
        this.model = model;
        this.form = form;
        this.errors = errors;
        this.validations = validations;
    }

    resetErrors() {
        this.errors = {formError: '', invalid: false};
    }

    handleResponseErrors(responseData) {
        this.errors.formError = responseData.title;
        if ('errors' in responseData) {
            for (let error of responseData.errors) {
                if (error.source in this.form) {
                    this.errors[error.source] = error.title;
                }
            }
        }
    }
}
