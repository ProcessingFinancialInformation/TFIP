module TFIP.Web.UI.Clients {

    export interface IClientService {
        isClientExist(clientId: string, clientType: string): ng.IPromise<any>;
        createClient(model: ClientViewModel): ng.IPromise<Shared.AjaxViewModel<ClientViewModel>>;
        getClientFormViewModel(): ng.IPromise<IndividualClientFormViewModel>;
        createJuridicalClient(model: JuridicalClientViewModel): ng.IPromise<Shared.AjaxViewModel<JuridicalClientViewModel>>;
        getClient(clientId: string, clientType: string): ng.IPromise<ClientViewModelBase>;
        showFindClients(): ng.IPromise<ClientViewModel>;
        showCreateClients(clientType: string): ng.IPromise<ClientViewModel>;
    }

    export class ClientService implements IClientService {
        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService",
            "$q",
            "$uibModal"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.ApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService) {
            
        }

        public showFindClients(): ng.IPromise<ClientViewModel> {
            var deferred = this.$q.defer();

            var modalPromise = this.$uibModal.open({
                templateUrl: "/Clients/FindClientsModal",
                controller: FindClientController
            });

            modalPromise.result.then((data: ClientViewModel) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public showCreateClients(clientType: string): ng.IPromise<ClientViewModel> {
            var deferred = this.$q.defer();
            var url = (clientType == (new ClientType()).individualClient) ? "/Clients/CreateIndividualClientForm" : "/Clients/CreateJuridicalClientForm";
            var modalPromise = this.$uibModal.open({
                templateUrl: url,
                controller: CreateClientController
            });

            modalPromise.result.then((data: ClientViewModel) => {
                deferred.resolve(data);
            }, () => {
                deferred.reject();
            });

            return deferred.promise;
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