import JWTHelper from "../../helpers/JWTHelper";

export default class AccountLocalStorageProvider {

    getUserToken() {
        let userToken = localStorage.getItem("userToken");
        if (userToken && userToken != 'null' && userToken != 'undefined') {
            //check token expiration time
            let currentTime = Math.floor(Date.now() / 1000);
            let decodedUserToken = JWTHelper.parseJwt(userToken);
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

    getAfterLoginRedirect() {
        return JSON.parse(localStorage.getItem("afterLoginRedirect"));
    }

    setAfterLoginRedirect(afterLoginRedirect) {
        localStorage.afterLoginRedirect = JSON.stringify(afterLoginRedirect);
    }
}
