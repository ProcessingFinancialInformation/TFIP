module TFIP.Web.UI.Clients {

    export interface IClientService {
        isClientExist(clientId: string, clientType: string): ng.IPromise<any>;
    }

    export class ClientService implements IClientService {
        public static $inject = [
            "$http",
            "apiUrlService",
            "urlBuilderService",
            "$q"
        ];

        constructor(
            private $http: ng.IHttpService,
            private apiUrlService: Core.ApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $q: ng.IQService) {
            
        }

        public isClientExist(clientId: string, clientType: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            if (clientId && clientType) {
                var url = this.urlBuilderService.buildQuery(this.apiUrlService.clientApi.exist, { clientType: clientType, clientId: clientId });
                this.$http.get(url).then(() => {
                    deferred.resolve();
                }, () => {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }
    }
}   