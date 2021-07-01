export default class AppFormInput {
    type;
    label;
    placeholder;
    errorLabels;
    style = {
        wrapClass: 'col-lg-12'
    };

    constructor(type, label, placeholder, errorLabels, style) {
        this.type = type;
        this.label = label;
        this.placeholder = placeholder;
        this.errorLabels = errorLabels;
        Object.assign(this.style, style);
    }
}
