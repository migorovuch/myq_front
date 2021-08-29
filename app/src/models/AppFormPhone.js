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
            showDialCodeInSelection: true,
        },
        inputOptions: {}
    };
    phoneObject = {};

    constructor(type, label, placeholder, errorLabels, style, title, phoneProps = {}, phoneObject = {}) {
        super(type, label, placeholder, errorLabels, style, title);
        Object.assign(this.phoneProps, phoneProps);
    }
}
