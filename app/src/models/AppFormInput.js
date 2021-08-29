export default class AppFormInput {
    type;
    label;
    placeholder;
    errorLabels;
    style = {
        wrapClass: 'col-lg-12'
    };
    title;

    constructor(type, label, placeholder, errorLabels, style, title = null) {
        this.type = type;
        this.label = label;
        this.placeholder = placeholder;
        this.errorLabels = errorLabels;
        Object.assign(this.style, style);
        this.title = title;
    }
}
