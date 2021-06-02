import ApiProvider from "./ApiProvider";

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

    getCompany(id, successCallback, failCallback) {
        let company = {
            id: id,
            name: 'My Company',
            email: 'mycompany@gmail.com',
            phone: '0983725399',
            logo: [],
            address: 'Lviv some Street 192',
            description: 'tra tata',
            photos: [],
        };
        successCallback(company);
        if(failCallback) {
            failCallback(company);
        }
    }
}
