import AccountApiProvider from "../../providers/api/AccountApiProvider";
import JWTHelper from "../../helpers/JWTHelper";
let accountApiProvider = new AccountApiProvider();

export default {
    namespaced: true,
    getters: {
        isUserLogged(state, getters, rootState, rootGetters) {
            return rootGetters.isUserLogged;
        },
        isAdmin(state, getters, rootState, rootGetters) {
            if (rootGetters.isUserLogged) {
                let token = rootGetters.getUserToken;
                token = JWTHelper.parseJwt(token);
                if (token.roles.includes("ROLE_ADMIN")) {
                    return true;
                }
            }

            return false;
        },
        getUserToken(state, getters, rootState, rootGetters) {
            return rootGetters.getUserToken;
        },
        getUserData(state, getters, rootState, rootGetters) {
            return rootGetters.getUserData;
        },
    },
    actions: {
        login(context, {data, successCallback, failCallback}) {
            accountApiProvider.login(
                data,
                (response) => {
                    context.commit('setUserToken', response.token, { root: true })
                    context.commit('setUserData', response.data, { root: true })
                    successCallback(response);
                },
                failCallback
            );
        },
        changeAccount(context, {data, successCallback, failCallback}) {
            accountApiProvider.changeAccount(
                data,
                (response) => {
                    context.commit('setUserData', response, { root: true })
                    successCallback(response);
                },
                failCallback
            );
        },
        logout(context) {
            context.commit('setUserToken', null, { root: true })
        },
        requestPassword(context, {data, successCallback, failCallback}) {
            accountApiProvider.requestPassword(data, successCallback, failCallback);
        },
        registration(context, {data, successCallback, failCallback}) {
            accountApiProvider.registration(data, successCallback, failCallback);
        },
        resetPassword(context, {data, successCallback, failCallback}) {
            accountApiProvider.resetPassword(data, successCallback, failCallback);
        },
    },
};
