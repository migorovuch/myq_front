import ApiProvider from "./ApiProvider";
import store from "../../store/store";

export default class CompanyApiProvider extends ApiProvider {
    create(data,successCallback, failCallback) {
        this.post('api/companies/', data, successCallback, failCallback);
    }

    update(id, data, successCallback, failCallback) {
        this.put('api/companies/' + id, data, successCallback, failCallback);
    }

    getMyCompany(successCallback, failCallback) {
        this.get('api/companies/my', null, successCallback, failCallback);
    }

    getMyCompanyAsync() {
        return this.asyncRequest('api/companies/my');
    }

    getCompanyList(filter, successCallback, failCallback) {
        this.get(
            'api/companies/search/app',
            {filter:filter},
            successCallback,
            failCallback
        );
    }

    uploadLogo(id, logo, successCallback, failCallback) {
        let formData = new FormData();
        formData.append(`logo`, logo, logo.name);
        this.request(
            'api/companies/logo/' + id,
            {
                method: 'POST',
                body: formData,
            },
            successCallback,
            failCallback
        );
    }
}
