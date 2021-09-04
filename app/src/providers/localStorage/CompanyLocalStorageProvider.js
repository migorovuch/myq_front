export default class CompanyLocalStorageProvider {

    getFavoriteCompanies() {
        let companies = localStorage.getItem("favoriteCompanies");
        if (!companies || companies == 'null' || companies == 'undefined' || companies == '') {
            companies = [];
        } else {
            companies = JSON.parse(companies);
        }

        return companies;
    }

    addFavoriteCompanies(data) {
        let companies = this.getFavoriteCompanies();
        companies.push(data);

        localStorage.favoriteCompanies = JSON.stringify(companies);
    }

}
