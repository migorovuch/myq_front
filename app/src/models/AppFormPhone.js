import AppFormInput from "./AppFormInput";

export default class AppFormPhone extends AppFormInput{
    phoneProps = {
        mode: "international",
        defaultCountry: "UA",
        enabledFlags: false,
        // preferredCountries: ["UA", "RU"],
        // onlyCountries: ["UA", "RU"],
        disabledFormatting: false,
        disabledDialCode: true,
        dropdownOptions: {
            showDialCodeInList: true,
            showFlags: true,
            showDialCodeInSelection: false,
        },
        inputOptions: {}
    };
    phoneObject = {};

    constructor(type, label, placeholder, errorLabels, style, phoneProps = {}, phoneObject = {}) {
        super(type, label, placeholder, errorLabels, style);
        Object.assign(this.phoneProps, phoneProps);
    }
}
