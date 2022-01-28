import AccountApiProvider from "../../providers/api/AccountApiProvider";

let accountApiProvider = new AccountApiProvider();

export default function approveEmailMiddleware({ to, next, store }) {
    if (!store.getters['account/isUserLogged']) {
        accountApiProvider.emailConfirmAsync(to.params.id, decodeURI(to.params.token))
            .then((response) => {
                if (response.ok) {
                    store.commit('account/setShowApproveMessage', 1);
                } else {
                    store.commit('account/setShowApproveMessage', 2);
                }

                return response.json();
            });

        return next({
            name: 'home',
        });
    } else {
        return next({
            name: 'home'
        });
    }
}



