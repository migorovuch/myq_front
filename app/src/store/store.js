import Vue from "vue";
import Vuex from "vuex";
import specialHours from "./modules/specialHours";
import schedule from "./modules/schedule";
import events from "./modules/events";

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
        events,
    },
    mutations: {
        setUserToken(state, userToken) {
            state.userToken = userToken;
        }
    }
});
