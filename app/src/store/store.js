import Vue from "vue";
import Vuex from "vuex";
import specialHours from "./modules/specialHours";
import schedule from "./modules/schedule";
import events from "./modules/events";
import account from "./modules/account";
import company from "./modules/company";
import availability from "./modules/availability";
import client from "./modules/client";
import loader from "./modules/loader";
import dashboard from "./modules/dashboard";
import user from "./modules/user";
import AccountLocalStorageProvider from "../providers/localStorage/AccountLocalStorageProvider";

let accountLocalStorageProvider = new AccountLocalStorageProvider();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userToken: accountLocalStorageProvider.getUserToken(),
        userData: accountLocalStorageProvider.getUserData(),
        isUserLogged: accountLocalStorageProvider.isUserLogged()
    },
    modules: {
        specialHours,
        schedule,
        events,
        account,
        company,
        availability,
        client,
        loader,
        dashboard,
        user
    },
    getters: {
        isUserLogged: state => state.isUserLogged,
        getUserToken: state => state.userToken,
        getUserData: state => state.userData,
    },
    mutations: {
        setUserToken(state, userToken) {
            accountLocalStorageProvider.setUserToken(userToken);
            state.userToken = accountLocalStorageProvider.getUserToken();
            state.isUserLogged = accountLocalStorageProvider.isUserLogged();
        },
        setUserData(state, data) {
            accountLocalStorageProvider.setUserData(data);
            state.userData = data;
        }
    }
});
