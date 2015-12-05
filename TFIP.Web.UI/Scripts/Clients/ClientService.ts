module TFIP.Web.UI.Clients {

    export interface IClientService {
        isClientExist(clientId: string, clientType: string): ng.IPromise<any>;
        createClient(model: ClientViewModel): ng.IPromise<Shared.AjaxViewModel<any>>;
        getClientFormViewModel(): ng.IPromise<IndividualClientFormViewModel>;
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

        public getClientFormViewModel(): ng.IPromise<IndividualClientFormViewModel> {
            var deferred = this.$q.defer();

            this.$http.get(this.apiUrlService.clientApi.getIndividualClientFormInfo).then((data) => {
                deferred.resolve(data.data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
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

        public createClient(model: ClientViewModel): ng.IPromise<Shared.AjaxViewModel<any>> {
            var deferred = this.$q.defer();

            this.$http.post(this.apiUrlService.clientApi.createClient, model).then((data) => {
                deferred.resolve(data.data);
            }, (reason: any) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }
    }
}   