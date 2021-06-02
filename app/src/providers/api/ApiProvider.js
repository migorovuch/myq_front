export default class ApiProvider {

    isUserLogged() {
        let userToken = localStorage.getItem("userToken");
        if (userToken && userToken !== 'null') {
            //check is token expired
            let currentTime = Math.floor(Date.now() / 1000);
            let decodedUserToken = this.parseJwt(userToken);
            return currentTime < decodedUserToken.exp;
        }
        return false;
    }

    parseJwt (token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    setToken(userToken) {
        localStorage.userToken = userToken;
    }

    getToken() {
        return localStorage.userToken;
    }

    buildUrlParams(params, parentStr = '') {
        return Object.keys(params)
            .map(
                key => {
                    let keyStr = parentStr ? `${parentStr}[${key}]` : key;
                    if (typeof (params[key]) === 'object') {
                        return this.buildUrlParams(params[key], keyStr)
                    }
                    return encodeURIComponent(this.toUnderscore(keyStr)) + '=' + encodeURIComponent(params[key]);
                }
            )
            .join('&');
    }

    request(url, options = {}, successCallback = null, failCallback = null, errorCallback = function () {}) {
        url = process.env.VUE_APP_API_URL + url;
        if ('body' in options && options.body && typeof options.body !== 'string') {
            options.body = JSON.stringify(this.underscoreObjectKeys(options.body));
        }
        if('queryParams' in options) {
            url += '?' + this.buildUrlParams(options.queryParams);
        }
        let requestOptions = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            method: 'GET'
        };
        if (this.isUserLogged()) {
            requestOptions.headers.Authorization = 'Bearer ' + this.getToken();
        }
        Object.assign(requestOptions, options);
        (async () => {
            return await fetch(url, requestOptions);
        })()
            .then(response => {
                if (response.ok) {
                    if (typeof successCallback === "function") {
                        response.json().then(data => {successCallback(this.camelObjectKeys(data))});
                    }
                } else {
                    if (typeof failCallback === "function") {
                        response.json().then(data => {failCallback(this.camelObjectKeys(data))});
                    }
                }
            })
            .catch(data => {errorCallback(this.camelObjectKeys(data))});
    }

    denyAccessUnlessGranted()
    {
        if(!this.getToken()) {
            throw new Error(this.$t('Authentication failed'));
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
                    if (typeof val === 'object') {
                        val = this.camelObjectKeys(val);
                    }
                    newObj[this.toCamel(key)] = val;
                }
            );

        return newObj;
    }
}
