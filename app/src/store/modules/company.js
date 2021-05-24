import CompanyApiProvider from "../../providers/api/CompanyApiProvider";
let companyApiProvider = new CompanyApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        model: null
    },
    getters: {
        getList: state => state.list,
        getModel: state => state.model,
    },
    actions: {
        load(context, idCompany) {
            context.commit('load', [idCompany]);
        },
        loadOne(context, {id, successCallback, failCallback}) {
            companyApiProvider.getCompany(
                id,
                (data) => {
                    if (successCallback) {
                        successCallback(data);
                    }
                    context.commit('loadOne', data);
                },
                failCallback
            );
        },
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
        loadOne(state, payload) {
            state.model = payload;
        }
    }
};
