module TFIP.Web.UI.Credit {
    
    export interface ICreditRequestService {
        showCreateCreditPopup(clientId: number, clientType: string): ng.IPromise<CreditRequestModel>;
        showCreditRequestDetailsPopup(requestId: number): ng.IPromise<any>;
        createCreditRequest(creditRequest: CreditRequestModel): ng.IPromise<Shared.AjaxViewModel<CreditRequestModel>>;
        getCreditRequestInfo(id: number): ng.IPromise<CreditRequestModel>;
    }

    export class CreditRequestService implements ICreditRequestService {
        
        public static $inject = [
            "httpWrapper",
            "messageBox",
            "$q",
            "$uibModal",
            "apiUrlService",
            "creditTypeService",
            "urlBuilderService"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private apiUrlService: Core.IApiUrlService,
            private creditTypeService: Credit.ICreditTypeService,
            private urlBuilderService: Core.IUrlBuilderService) {
            
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

        public showCreditRequestDetailsPopup(requestId: number): ng.IPromise<any> {
            var deferred = this.$q.defer();

            this.getCreditRequestInfo(requestId).then((data: CreditRequestModel) => {
                var modalInstance = this.$uibModal.open({
                    templateUrl: "/Credit/CreditRequestDetails",
                    controller: CreditRequestDetailsController,
                    resolve: {
                        creditRequest: () => data
                    }
                });

                modalInstance.result.then((modalData: any) => {
                    deferred.resolve(data);
                }, (reason: any) => {
                    deferred.reject(reason);
                });
            }, (reason: Core.IRejectionReason) => {
                    this.messageBox.showError(Const.Messages.creditRequestInfo, reason.message);
                deferred.reject();
            });

            return deferred.promise;
        }

        public createCreditRequest(creditRequest: CreditRequestModel): ng.IPromise<Shared.AjaxViewModel<CreditRequestModel>> {
            return this.httpWrapper.post(this.apiUrlService.creditRequestApi.saveCreditRequest, creditRequest);
        }

        public getCreditRequestInfo(id: number): ng.IPromise<CreditRequestModel> {
            return this.httpWrapper.get(this.urlBuilderService.buildQuery(this.apiUrlService.creditRequestApi.getCreditRequest, { id: id }));
        }
    }
} 