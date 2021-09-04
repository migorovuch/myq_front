import AppFormInput from "./AppFormInput";

export default class AppFormSelect extends AppFormInput{
    options;
    multiple = false;
    selectSize = 1;

    constructor(type, label, placeholder, errorLabels, style, title, options, multiple = false, selectSize = 1) {
        super(type, label, placeholder, errorLabels, style, title);
        this.options = options ? options : {};
        this.multiple = multiple;
        this.selectSize = selectSize;
    }
}
