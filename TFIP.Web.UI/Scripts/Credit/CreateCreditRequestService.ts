module TFIP.Web.UI.Credit {
    
    export interface ICreateCreditRequestService {
        showCreateCreditPopup(clientId: number, clientType: string): ng.IPromise<CreditRequestModel>;
        createCreditRequest(creditRequest: CreditRequestModel): ng.IPromise<Shared.AjaxViewModel<CreditRequestModel>>;
    }

    export class CreateCreditRequestService implements ICreateCreditRequestService {
        
        public static $inject = [
            "httpWrapper",
            "messageBox",
            "$q",
            "$uibModal",
            "apiUrlService",
            "creditTypeService"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private apiUrlService: Core.IApiUrlService,
            private creditTypeService: Credit.ICreditTypeService) {
            
        }

        public showCreateCreditPopup(clientId: number, clientType: string): ng.IPromise<CreditRequestModel> {
            var deferred = this.$q.defer();

            if (clientId && clientType) {
                this.creditTypeService.getCreditTypes(true).then((data: CreditTypeModel[]) => {
                    var modalInstance = this.$uibModal.open({
                        templateUrl: "/Credit/CreateCreditRequest",
                        controller: CreateCreditRequestController,
                        resolve: {
                            creditTypes: () => data,
                            clientId: () => clientId,
                            clientType: () => clientType
                        }
                    });

                    modalInstance.result.then((creditRequest: CreditRequestModel) => {
                        deferred.resolve(creditRequest);
                    }, (reason) => {
                        deferred.reject(reason);
                    });
                }, (reason: Core.IRejectionReason) => {
                    this.messageBox.showError(Const.Messages.creditCreation, reason.message);
                });

                return deferred.promise;
            }

            deferred.reject();
            return deferred.promise;
        }

        public createCreditRequest(creditRequest: CreditRequestModel): ng.IPromise<Shared.AjaxViewModel<CreditRequestModel>> {
            return this.httpWrapper.post(this.apiUrlService.creditRequestApi.saveCreditRequest, creditRequest);
        }
    }
} 