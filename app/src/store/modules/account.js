import AccountApiProvider from "../../providers/api/AccountApiProvider";
let accountApiProvider = new AccountApiProvider();

export default {
    namespaced: true,
    state: {
        isUserLogged: accountApiProvider.isUserLogged(),
        userData: null
    },
    getters: {
        isUserLogged: state => state.isUserLogged,
        getUserData: state => state.userData,
    },
    actions: {
        login(context, {data, successCallback, failCallback}) {
            accountApiProvider.login(
                data,
                (response) => {
                    successCallback(response);
                    context.commit('login');
                },
                failCallback
            );
        },
        logout(context) {
            accountApiProvider.logout();
            context.commit('logout');
        },
        requestPassword(context, data, successCallback, failCallback) {
            accountApiProvider.requestPassword(data, successCallback, failCallback);
        },
        registration(context, data, successCallback, failCallback) {
            accountApiProvider.registration(data, successCallback, failCallback);
        },
        resetPassword(context, data, successCallback, failCallback) {
            accountApiProvider.resetPassword(data, successCallback, failCallback);
        },
    },
    mutations: {
        login(state) {
            state.isUserLogged = true;
        },
        logout(state) {
            state.isUserLogged = false;
        },
    }
};
