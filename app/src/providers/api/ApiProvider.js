import store from "../../store/store";
import i18n from "../../plugins/i18n";

export default class ApiProvider {

    buildUrlParams(params, parentStr = '') {
        return Object.keys(params)
            .map(
                key => {
                    if (params[key] == null) {
                        return null;
                    }
                    let keyStr = parentStr ? `${parentStr}[${key}]` : key;
                    if (typeof (params[key]) === 'object') {
                        return this.buildUrlParams(params[key], keyStr)
                    }
                    return encodeURIComponent(this.toUnderscore(keyStr)) + '=' + encodeURIComponent(params[key]);
                }
            )
            .join('&');
    }

    asyncRequest(url, options = {}) {
        let apiUrl = process.env.VUE_APP_API_URL;
        if (!apiUrl.includes(window.location.origin)) {
            url = apiUrl + url;
        }
        if ('body' in options && options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
            options.body = JSON.stringify(this.underscoreObjectKeys(options.body));
        }
        if ('queryParams' in options && Object.keys(options.queryParams).length) {
            url += '?' + this.buildUrlParams(options.queryParams);
        }
        let requestOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Accept-Language': i18n.locale
            }
        };
        if (!(options.body instanceof FormData)) {
            requestOptions.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
        Object.assign(requestOptions, options);
        if (store.getters['account/isUserLogged']) {
            requestOptions.headers.Authorization = 'Bearer ' + store.getters['account/getUserToken'];
        }

        return fetch(url, requestOptions);
    }

    request(url, options = {}, successCallback = null, failCallback = null, errorCallback = function () {}) {
        store.commit('loader/startLoading');
        (async () => {
            return await this.asyncRequest(url, options);
        })()
            .then(response => {
                if (response.ok) {
                    if (typeof successCallback === "function") {
                        response.json().then(data => {successCallback(this.camelObjectKeys(data))});
                    }
                } else {
                    if (response.status === 401) {
                        store.dispatch('account/logout');
                        store.commit('account/addAfterLoginActions', {
                            func: this.request.bind(this),
                            url,
                            options,
                            successCallback,
                            failCallback,
                            errorCallback
                        });
                    }
                    if (typeof failCallback === "function") {
                        response.json().then(data => {failCallback(this.camelObjectKeys(data), response.status)});
                    }
                }
                store.commit('loader/endLoading');
            })
            .catch(data => {
                store.commit('loader/endLoading');
                errorCallback(this.camelObjectKeys(data));
            });
    }

    denyAccessUnlessGranted()
    {
        if(!this.getToken()) {
            throw new Error(this.$t('views_auth.Authentication failed'));
        }
    }

    get(url, queryParams = null, successCallback = null, failCallback = null, errorCallback = function () {}) {
        this.request(url, (queryParams ? {queryParams: queryParams} : {}), successCallback, failCallback, errorCallback);
    }

    post(url, body, successCallback = null, failCallback = null, errorCallback = function () {}) {
        this.request(url, {body: body, method: 'POST'}, successCallback, failCallback, errorCallback);
    }

    put(url, body, successCallback = null, failCallback = null, errorCallback = function () {}) {
        this.request(url, {body: body, method: 'PUT'}, successCallback, failCallback, errorCallback);
    }

    delete(url, body, successCallback = null, failCallback = null, errorCallback = function () {}) {
        this.request(url, {body: body, method: 'DELETE'}, successCallback, failCallback, errorCallback);
    }

    patch(url, body, successCallback = null, failCallback = null, errorCallback = function () {}) {
        this.request(url, {body: body, method: 'PATCH'}, successCallback, failCallback, errorCallback);
    }

    uploadFiles(url, files, successCallback = null, failCallback = null, errorCallback = function () {}) {
        let formData = new FormData();
        for (let fileKey in files) {
            formData.append(`files`, files[fileKey], files[fileKey].name);
        }
        this.request(
            url,
            {body: formData, method: 'PATCH', headers:{'Content-Type': 'multipart/form-data'}},
            successCallback,
            failCallback,
            errorCallback
        );
    }

    toCamel(s) {
        return s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });
    }

    toUnderscore(s) {
        return s.replace(/\.?([A-Z])/g, function (x, y) {
            return "_" + y.toLowerCase()
        }).replace(/^_/, "");
    }

    underscoreObjectKeys(obj) {
        let newObj = Array.isArray(obj)?[]:{};
        Object.keys(obj)
            .map(
                key => {
                    let val = obj[key];
                    if (typeof val === 'object' && val) {
                        val = this.underscoreObjectKeys(val);
                    }
                    newObj[this.toUnderscore(key)] = val;
                }
            );

        return newObj;
    }

    camelObjectKeys(obj) {
        let newObj = Array.isArray(obj)?[]:{};
        Object.keys(obj)
            .map(
                key => {
                    let val = obj[key];
                    if (typeof val === 'object' && val !== null) {
                        val = this.camelObjectKeys(val);
                    }
                    newObj[this.toCamel(key)] = val;
                }
            );

        return newObj;
    }
}
