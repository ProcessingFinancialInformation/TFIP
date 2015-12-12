module TFIP.Web.UI.Credit {
    export interface ICreateCreditRequestScope extends ng.IScope {
        creditRequestModel: CreditRequestModel;
        addGuarantor: () => void
        creditTypes: CreditTypeModel[];
        creditTypesViewModel: Shared.ListItem[];
        guarantorRequired: () => boolean;
        documentsRequired: () => boolean;
        getMinAmount: () => number;
        getMaxAmount: () => number;
        onSaveClick: () => void;
        creditRequestForm: Core.ICustomFormController;
        regex: Const.RegularExpressions;
        editGuarantor: (index: number) => void;
    }

    export class CreateCreditRequestController extends Core.BaseController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "messageBox",
            "clientService",
            "creditTypes",
            "clientId",
            "clientType",
            "createCreditRequestService"
        ];

        constructor(
            private $scope: ICreateCreditRequestScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private messageBox: Core.IMessageBoxService,
            private clientService: Clients.IClientService,
            private creditTypes: CreditTypeModel[],
            private clientId: number,
            private clientType: string,
            private createCreditRequestService: ICreateCreditRequestService) {
            super();
            this.$scope.creditRequestModel = new CreditRequestModel();
            this.$scope.creditRequestModel.clientId = clientId;
            this.$scope.creditRequestModel.clientType = clientType;
            this.$scope.addGuarantor = () => this.addGuarantor();
            this.$scope.documentsRequired = () => this.documentsRequired();
            this.$scope.guarantorRequired = () => this.guarantorRequired();
            this.$scope.getMinAmount = () => this.getMinAmount();
            this.$scope.getMaxAmount = () => this.getMaxAmount();
            this.$scope.creditTypes = creditTypes;
            this.$scope.creditTypesViewModel = creditTypes.asEnumerable().select((ct: CreditTypeModel) => {
                return {
                    id: ct.id.toString(),
                    value: ct.name
                }
            }).toArray();
            this.$scope.onSaveClick = () => this.createCreditRequest();
            this.$scope.editGuarantor = (index: number) => this.editGuarantor(index);
            this.$scope.regex = new Const.RegularExpressions();
        }

        private createCreditRequest() {
            if (!this.$scope.creditRequestForm.$valid) {
                this.makeFormDirty(this.$scope.creditRequestForm);
                this.messageBox.showError(Const.Messages.creditCreation, Const.Messages.invalidForm);
                return;
            } 
            if (this.guarantorRequired() && (!this.$scope.creditRequestModel.guarantors || this.$scope.creditRequestModel.guarantors.length == 0)) {
                this.messageBox.showError(Const.Messages.creditCreation, Const.Messages.creditRequestNoGuarantors);
                return;
            }

            var promise = this.createCreditRequestService.createCreditRequest(this.$scope.creditRequestModel);

            promise.then((data: Shared.AjaxViewModel<CreditRequestModel>) => {
                if (data.isValid) {
                    this.$uibModalInstance.close(data.data);
                } else {
                    this.messageBox.showErrorMulty(Const.Messages.creditCreation, data.errors);
                }
            }, (reason: Core.IRejectionReason) => {
                this.messageBox.showError(Const.Messages.creditCreation, reason.message);
            });
        }

        private addGuarantor() {
            this.clientService.showFindClients().then((data: Clients.ClientViewModel) => {
                this.pushGuarantor(data);
                console.log(this.$scope.creditRequestModel);
            }, (data: string) => {
                if (data) {
                    this.clientService.showCreateClients(data).then((data: Clients.ClientViewModel) => {
                        this.pushGuarantor(data);
                    });
                }
            });
        }

        private pushGuarantor(data: Clients.ClientViewModel) {
            if (data) {
                console.log(data);
                if (!this.$scope.creditRequestModel.guarantors) {
                    this.$scope.creditRequestModel.guarantors = [];
                }
                this.$scope.creditRequestModel.guarantors.push(data);
            }
        }

        private guarantorRequired() {
            var creditType = this.getCurrentCreditType();

            if (creditType) {
                return creditType.isGuarantorRequired;
            }
        }

        private documentsRequired() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.isDocumentsRequired;
            }
        }

        private getMinAmount() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.amountFrom;
            }
        }

        private getMaxAmount() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.amountTo;
            }
        }

        private getCurrentCreditType(): CreditTypeModel {
            return this.$scope.creditTypes.asEnumerable().firstOrDefault((ct: CreditTypeModel) => {
                return ct.id == this.$scope.creditRequestModel.creditTypeId;
            });
        }

        private editGuarantor(index: number) {
            var guarantor = this.$scope.creditRequestModel.guarantors[index];

            this.clientService.showCreateClients(new Clients.ClientType().individualClient, guarantor).then((data: Clients.ClientViewModel) => {
                this.$scope.creditRequestModel.guarantors[index] = data;
            });
        }
    }
} 