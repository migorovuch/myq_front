import Vue from "vue";
import Vuex from "vuex";
import specialHours from "./modules/specialHours";
import schedule from "./modules/schedule";
import events from "./modules/events";
import account from "./modules/account";
import company from "./modules/company";
import AccountLocalStorageProvider from "../providers/localStorage/AccountLocalStorageProvider";

let accountLocalStorageProvider = new AccountLocalStorageProvider();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userToken: accountLocalStorageProvider.getUserToken(),
        isUserLogged: accountLocalStorageProvider.isUserLogged()
    },
    modules: {
        specialHours,
        schedule,
        events,
        account,
        company
    },
    getters: {
        isUserLogged: state => state.isUserLogged,
        getUserToken: state => state.userToken,
    },
    mutations: {
        setUserToken(state, userToken) {
            accountLocalStorageProvider.setUserToken(userToken);
            state.userToken = accountLocalStorageProvider.getUserToken();
            state.isUserLogged = accountLocalStorageProvider.isUserLogged();

        },
    }
});
