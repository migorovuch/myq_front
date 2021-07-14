export default class ClientLocalStorageProvider {

    getClientId() {
        let clientId = localStorage.getItem("clientId");
        if (clientId && clientId != 'null' && clientId != 'undefined') {
            return clientId;
        }
        return null;
    }

    setClientId(clientId) {
        localStorage.clientId = clientId;
    }
}
