export default class ClientLocalStorageProvider {

    getClientIdList() {
        let clientIdList = localStorage.getItem("clientIdList");
        if (clientIdList && clientIdList != 'null' && clientIdList != 'undefined') {
            clientIdList = JSON.parse(clientIdList);
            if (typeof clientIdList === 'object') {
                return clientIdList;
            }
        }
        return null;
    }

    getCompanyClientId(companyId) {
        const clientIdList = this.getClientIdList();
        if (clientIdList && companyId in clientIdList) {
            return clientIdList[companyId];
        }

        return null;
    }

    setClientId(companyId, clientId) {
        let clientIdList = this.getClientIdList();
        if (!clientIdList) {
            clientIdList = {};
        }
        clientIdList[companyId] = clientId;
        localStorage.clientIdList = JSON.stringify(clientIdList);
    }

    deleteCompanyClientId(companyId) {
        const clientIdList = this.getClientIdList();
        if (clientIdList && companyId in clientIdList) {
            delete clientIdList[companyId];
            localStorage.clientIdList = JSON.stringify(clientIdList);
            return true;
        }

        return false;
    }
}
