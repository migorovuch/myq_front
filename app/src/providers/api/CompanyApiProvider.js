import ApiProvider from "./ApiProvider";

export default class CompanyApiProvider extends ApiProvider {
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
        // this.get(
        //     'companies/my-company',
        //     null,
        //     data => {
        //         this.setToken(data.token);
        //         successCallback(data)
        //     },
        //     failCallback
        // );
    }
}
