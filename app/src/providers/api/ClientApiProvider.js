import ApiProvider from "./ApiProvider";

export default class ClientApiProvider extends ApiProvider {

    getClient(id, successCallback, failCallback) {
        this.get('clients/'+id+'/app', null, successCallback, failCallback);
    }
}
