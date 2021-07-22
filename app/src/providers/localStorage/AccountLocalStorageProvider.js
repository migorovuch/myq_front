export default class AccountLocalStorageProvider {

    getUserToken() {
        let userToken = localStorage.getItem("userToken");
        if (userToken && userToken != 'null' && userToken != 'undefined') {
            //check token expiration time
            let currentTime = Math.floor(Date.now() / 1000);
            let decodedUserToken = this.parseJwt(userToken);
            if (currentTime < decodedUserToken.exp) {
                return userToken;
            }
        }

        return null;
    }

    setUserToken(userToken) {
        localStorage.userToken = userToken;
    }

    getUserData() {
        let userData = localStorage.getItem("userData");
        if (userData && userData != 'null' && userData != 'undefined') {
            return JSON.parse(userData);
        }

        return null;
    }

    setUserData(userData) {
        localStorage.userData = JSON.stringify(userData);
    }

    isUserLogged() {
        return null !== this.getUserToken();
    }

    parseJwt (token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}
