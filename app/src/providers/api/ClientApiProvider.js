import ApiProvider from "./ApiProvider";

export default class ClientApiProvider extends ApiProvider {

    getClient(id, successCallback, failCallback) {
        this.get('api/clients/'+id+'/app', null, successCallback, failCallback);
    }

    getClientsList(filter, successCallback, failCallback) {
        this.get(
            'api/clients/search',
            {filter: filter},
            successCallback,
            failCallback
        );
    }

    change(id, data, successCallback, failCallback) {
        this.patch('api/clients/' + id, data, successCallback, failCallback);
    }

    updateClients(data, successCallback, failCallback) {
        this.post('api/clients/update-clients', data, successCallback, failCallback);
    }
}
