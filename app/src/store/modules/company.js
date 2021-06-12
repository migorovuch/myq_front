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
                    if (Object.keys(data).length) {
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
                    if (Object.keys(companyData).length) {
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
                    if (Object.keys(companyData).length) {
                        context.commit('loadOne', companyData);
                    }
                    if (successCallback) {
                        successCallback(companyData);
                    }
                },
                failCallback
            );
        },

        uploadLogo(context, {id, data, successCallback, failCallback}) {
            companyApiProvider.uploadLogo(
                id,
                data,
                (response) => {
                    context.commit('loadLogo', response.fileName);
                    if (successCallback) {
                        successCallback(response);
                    }
                },
                failCallback
            );
        }
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
        loadOne(state, payload) {
            state.model = payload;
        },
        loadLogo(state, payload) {
            state.model.logo = payload;
        }
    }
};
