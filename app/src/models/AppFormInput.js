export default class AppFormInput {
    type;
    label;
    placeholder;
    errorLabels;

    constructor(type, label, placeholder, errorLabels) {
        this.type = type;
        this.label = label;
        this.placeholder = placeholder;
        this.errorLabels = errorLabels;
    }
}
