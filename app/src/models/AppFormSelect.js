import AppFormInput from "./AppFormInput";

export default class AppFormSelect extends AppFormInput{
    options;

    constructor(type, label, placeholder, errorLabels, style, options) {
        super(type, label, placeholder, errorLabels, style);
        this.options = options ? options : {};
    }
}
