import CompanyApiProvider from "../../providers/api/CompanyApiProvider";
let companyApiProvider = new CompanyApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        listTotal: 0,
        model: null
    },
    getters: {
        getList: state => state.list,
        getListTotal: state => state.listTotal,
        getModel: state => state.model,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            companyApiProvider.getCompanyList(
                filter,
                (data) => {
                    context.commit('load', data.data);
                    context.commit('setListTotal', data.total);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        loadOne(context, {id, successCallback, failCallback}) {
            companyApiProvider.getCompanyList(
                {id: id},
                (data) => {
                    if ('data' in data && data.data.length) {
                        context.commit('loadOne', data.data[0]);
                        if (successCallback) {
                            successCallback(data);
                        }
                    }
                },
                failCallback
            );
        },
        loadPublic(context, {filter, successCallback, failCallback}) {
            companyApiProvider.getPublicCompanyList(
                filter,
                (data) => {
                    context.commit('load', data.data);
                    context.commit('setListTotal', data.total);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        },
        loadPublicOne(context, {id, successCallback, failCallback}) {
            companyApiProvider.getPublicCompanyList(
                {id: id},
                (data) => {
                    if ('data' in data && data.data.length) {
                        context.commit('loadOne', data.data[0]);
                        if (successCallback) {
                            successCallback(data);
                        }
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
                failCallback,
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
        },
        setListTotal(state, payload) {
            state.listTotal = payload;
        }
    }
};
