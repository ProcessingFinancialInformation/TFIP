module TFIP.Web.UI.Credit {
    
    export interface ICreateCreditRequestService {
        showCreateCreditPopup(clientId: number, clientType: string): ng.IPromise<any>;
    }

    export class CreateCreditRequestService implements ICreateCreditRequestService {
        
        public static $inject = [
            "httpWrapper",
            "messageBox",
            "$q",
            "$uibModal",
            "apiUrlService"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private apiUrlService: Core.IApiUrlService) {
            
        }

        public showCreateCreditPopup(clientId: number, clientType: string): ng.IPromise<any> {
            var deferred = this.$q.defer();

            if (clientId && clientType) {
                //this.httpWrapper.get(this.apiUrlService.creditTypeApi.getCredtType);

                var modalInstance = this.$uibModal.open({
                    templateUrl: "/Credit/CreateCreditRequest",
                    controller: CreateCreditRequestController
                });

                modalInstance.result.then(() => {
                    deferred.resolve();
                }, (reason) => {
                    deferred.reject(reason);
                    });

                return deferred.promise;
            }

            deferred.reject();
            return deferred.promise;
        }
    }
} 