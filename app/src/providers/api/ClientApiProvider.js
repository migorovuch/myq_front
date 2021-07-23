import ApiProvider from "./ApiProvider";

export default class ClientApiProvider extends ApiProvider {

    getClient(id, successCallback, failCallback) {
        this.get('clients/'+id+'/app', null, successCallback, failCallback);
    }

    getClientsList(filter, successCallback, failCallback) {
        this.get(
            'clients/search',
            {filter: filter},
            successCallback,
            failCallback
        );
    }

    change(id, data, successCallback, failCallback) {
        this.patch('clients/' + id, data, successCallback, failCallback);
    }
}