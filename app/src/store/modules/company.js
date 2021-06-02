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
                    context.commit('loadOne', data);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        loadMyCompany(context, {successCallback, failCallback}) {
            companyApiProvider.getMyCompany(
                (data) => {
                    if (data.length) {
                        context.commit('loadOne', data);
                    }
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        create(context, {data, successCallback, failCallback}) {
            companyApiProvider.create(
                data,
                (companyData) => {
                    if (Object.keys(companyData).length === 0) {
                        context.commit('loadOne', companyData);
                    }
                    if (successCallback) {
                        successCallback(companyData);
                    }
                },
                failCallback
            );
        },
        update(context, {id, data, successCallback, failCallback}) {
            companyApiProvider.update(
                id,
                data,
                (companyData) => {
                    if (Object.keys(companyData).length === 0) {
                        context.commit('loadOne', companyData);
                    }
                    if (successCallback) {
                        successCallback(companyData);
                    }
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
