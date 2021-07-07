import CompanyApiProvider from "../../providers/api/CompanyApiProvider";

let companyApiProvider = new CompanyApiProvider();

export default async function companyMiddleware({ next, store }) {
    if (store.getters['account/isUserLogged']) {
        let company = await companyApiProvider.getMyCompanyAsync()
            .then((response) => response.json())
            .then((responseJson) => {return responseJson});

        return next({
            name: 'company_vue',
            params: {id: company.id}
        });
    } else {
        return next({
            name: 'home'
        });
    }
}



