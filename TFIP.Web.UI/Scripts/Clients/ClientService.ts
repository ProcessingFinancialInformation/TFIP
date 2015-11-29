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
                var url = this.urlBuilderService.buildQuery(this.apiUrlService.clientApi.exist, { clientType: clientType, individualNumber: clientId });
                this.$http.get(url).then((data: any) => {
                    deferred.resolve(data.data);
                }, (reason: any) => {
                    deferred.reject(reason);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }
    }
}   