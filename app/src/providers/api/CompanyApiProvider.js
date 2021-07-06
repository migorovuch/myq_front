import ApiProvider from "./ApiProvider";
import store from "../../store/store";

export default class CompanyApiProvider extends ApiProvider {
    create(data,successCallback, failCallback) {
        this.post('companies/', data, successCallback, failCallback);
    }

    update(id, data, successCallback, failCallback) {
        this.put('companies/' + id, data, successCallback, failCallback);
    }

    getMyCompany(successCallback, failCallback) {
        this.get('companies/my', null, successCallback, failCallback);
    }

    getMyCompanyAsync() {
        return this.asyncRequest('companies/my');
    }

    getCompanyList(filter, successCallback, failCallback) {
        this.get(
            'companies/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    uploadLogo(id, logo, successCallback, failCallback) {
        let formData = new FormData();
        formData.append(`logo`, logo, logo.name);
        this.request(
            'companies/logo/' + id,
            {
                method: 'POST',
                body: formData,
            },
            successCallback,
            failCallback
        );
    }
}
