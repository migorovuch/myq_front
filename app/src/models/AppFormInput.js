export default class AppFormInput {
    type;
    label;
    placeholder;
    errorLabels;
    style;

    constructor(type, label, placeholder, errorLabels, style) {
        this.type = type;
        this.label = label;
        this.placeholder = placeholder;
        this.errorLabels = errorLabels;
        this.style = style ? style : {};
    }
}
