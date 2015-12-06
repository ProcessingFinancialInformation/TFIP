module TFIP.Web.UI.Clients {

    export interface IClientService {
        isClientExist(clientId: string, clientType: string): ng.IPromise<any>;
        createClient(model: ClientViewModel): ng.IPromise<Shared.AjaxViewModel<ClientViewModel>>;
        getClientFormViewModel(): ng.IPromise<IndividualClientFormViewModel>;
        createJuridicalClient(model: JuridicalClientViewModel): ng.IPromise<Shared.AjaxViewModel<JuridicalClientViewModel>>;
        getClient(clientId: string, clientType: string): ng.IPromise<ClientViewModelBase>;
    }

    export class ClientService implements IClientService {
        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService",
            "$q"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.ApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $q: ng.IQService) {
            
        }

        public getClient(clientId: string, clientType: string): ng.IPromise<ClientViewModelBase> {
            var deferred = this.$q.defer();
            var url = this.urlBuilderService.buildQuery(this.apiUrlService.clientApi.getClient, { clientId: clientId, clientType: clientType });
            this.httpWrapper.get(url).then((data: ClientViewModelBase) => {
                deferred.resolve(data);
            }, (reason) => {
                    deferred.reject(reason);
            });

            return deferred.promise;
        }

        public getClientFormViewModel(): ng.IPromise<IndividualClientFormViewModel> {
            var deferred = this.$q.defer();

            this.httpWrapper.get(this.apiUrlService.clientApi.getIndividualClientFormInfo).then((data) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public isClientExist(clientId: string, clientType: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            if (clientId && clientType) {
                var url = this.urlBuilderService.buildQuery(this.apiUrlService.clientApi.exist, { clientType: clientType, individualNumber: clientId });
                this.httpWrapper.get(url).then((data: any) => {
                    deferred.resolve(data);
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

            this.httpWrapper.post(this.apiUrlService.clientApi.createClient, model).then((data) => {
                deferred.resolve(data);
            }, (reason: any) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public createJuridicalClient(model: JuridicalClientViewModel): ng.IPromise<Shared.AjaxViewModel<any>> {
            var deferred = this.$q.defer();

            this.httpWrapper.post(this.apiUrlService.clientApi.createJuridicalClient, model).then((data) => {
                deferred.resolve(data);
            }, (reason: any) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }
    }
}   