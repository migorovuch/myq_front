export default class AppFormInput {
    type;
    label;
    placeholder;
    errorLabels;
    style;
    options;

    constructor(type, label, placeholder, errorLabels, style, options) {
        this.type = type;
        this.label = label;
        this.placeholder = placeholder;
        this.errorLabels = errorLabels;
        this.style = style ? style : {};
        this.options = options ? options : {};
    }
}
