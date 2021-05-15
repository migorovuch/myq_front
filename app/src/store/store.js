import Vue from "vue";
import Vuex from "vuex";
import specialHours from "./modules/specialHours";
import schedule from "./modules/schedule";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        errors: [],
        success: true,
        userToken: ""
    },
    modules: {
        specialHours,
        schedule,
    },
    mutations: {
        setUserToken(state, userToken) {
            state.userToken = userToken;
        }
    }
});
