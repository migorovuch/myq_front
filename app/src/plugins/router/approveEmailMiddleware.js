import AccountApiProvider from "../../providers/api/AccountApiProvider";

let accountApiProvider = new AccountApiProvider();

export default function approveEmailMiddleware({ to, next, store }) {
    if (!store.getters['account/isUserLogged']) {
        accountApiProvider.emailConfirmAsync(to.params.id, to.params.token)
            .then((response) => response.json())
            .then((responseJson) => {return responseJson});

        return next({
            name: 'home',
        });
    } else {
        return next({
            name: 'home'
        });
    }
}



