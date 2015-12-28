module TFIP.Web.UI.Clients {
    export interface IClientScope extends ng.IScope {
        clientViewModel: ClientViewModelBase;
        createCreditRequest: () => void;
        clientType: string;
        makePayment: (request: Credit.CreditRequestModel) => void;
        getCreditRequestDetails: (creditRequest: Credit.CreditRequestModel) => void;
        clientTypes: ClientType;
        getClientName: () => string;
        canMakePayment: (request: Credit.CreditRequestModel) => boolean;
        editClient: () => void;
        approveRequest: (request: Credit.CreditRequestModel) => void;
        denyRequest: (request: Credit.CreditRequestModel) => void;
    }

    export class ClientController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService",
            "paymentsService",
            "creditRequestService"
        ];

        constructor(
            private $scope: IClientScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private paymentsService: Payments.IPaymentsService,
            private creditRequestService: Credit.ICreditRequestService) {

            var clientId = this.locationHelperService.getParameterValue("clientId");
            var clientType = this.locationHelperService.getParameterValue("clientType");
            
            if (clientId && clientType) {
                this.init(clientId, clientType);
                this.$scope.clientType = clientType;
            } else {
                this.messageBox.showError(Const.Messages.clients, "Идентификатор и/или тип клиента не определен").finally(() => {
                    this.locationHelperService.redirect("/Clients");
                });
            }

            this.$scope.createCreditRequest = () => this.createCreditRequest();
            this.$scope.makePayment = (request: Credit.CreditRequestModel) => this.makePayment(request);
            this.$scope.getCreditRequestDetails = (creditRequest: Credit.CreditRequestModel) => this.getCreditRequestDetails(creditRequest);
            this.$scope.clientTypes = new ClientType();
            this.$scope.getClientName = () => this.getClientName();
            this.$scope.canMakePayment = (request: Credit.CreditRequestModel) => this.canMakePayment(request);
            this.$scope.editClient = () => this.editClient();
            this.$scope.approveRequest = (request: Credit.CreditRequestModel) => this.approveRequest(request);
            this.$scope.denyRequest = (request: Credit.CreditRequestModel) => this.denyRequest(request);
        }

        private init(clientId: string, clientType: string) {
            var promise = this.clientService.getClient(clientId, clientType);
            promise.then((data: ClientViewModelBase) => {
                this.$scope.clientViewModel = data;
            }, (reason: Core.IRejectionReason) => {
                if (!reason.aborted) {
                    this.messageBox.showError(Const.Messages.clients, reason.message).finally(() => {
                        this.locationHelperService.redirect("/Clients");
                    });
                }
            });
        }

        private createCreditRequest() {
            this.creditRequestService.showCreateCreditPopup(this.$scope.clientViewModel.id, this.$scope.clientType).then((data: Credit.CreditRequestModel) => {
                if (data) {
                    this.$scope.clientViewModel.credits.push(data);
                }
            });
        }

        private editClient() {
            if (this.$scope.clientType.toLowerCase() == this.$scope.clientTypes.individualClient.toLowerCase() ) {
                this.locationHelperService.redirect('/Clients/CreateIndividualClient?' + 'clientId=' + this.$scope.clientViewModel.id);
            }
            if (this.$scope.clientType.toLowerCase() == this.$scope.clientTypes.juridicalPerson.toLowerCase()) {
                this.locationHelperService.redirect('/Clients/CreateJuridicalPersonClient?' + 'clientId=' + this.$scope.clientViewModel.id);
            }
        }

        private getClientName() {
            if (this.$scope.clientViewModel) {
                if (this.$scope.clientType.toLowerCase() == this.$scope.clientTypes.individualClient.toLowerCase()) {
                    var name = [this.$scope.clientViewModel.lastName, this.$scope.clientViewModel.firstName, this.$scope.clientViewModel.patronymic].join(" ");
                    return name;
                } else {
                    return this.$scope.clientViewModel.name;
                }
            }
        }

        private makePayment(request: Credit.CreditRequestModel) {
            this.paymentsService.showMakePayment(request.id).then((data: number) => {
                if (data) {
                    this.messageBox.show(Const.Messages.payment, Const.Messages.paymentDone + data);
                }
            });
        }

        private getCreditRequestDetails(creditRequest: Credit.CreditRequestModel) {
            this.creditRequestService.showCreditRequestDetailsPopup(creditRequest.id);
        }

        private canMakePayment(request: Credit.CreditRequestModel): boolean {
            return request.statusId == Credit.CreditRequestStatus.InProgress;
        }

        private approveRequest(request: Credit.CreditRequestModel) {
            if (request.statusId == Credit.CreditRequestStatus.AwaitingSecurityValidation) {
                this.creditRequestService.approveRequestBySecurity(request.id)
                    .then((data: Credit.CreditRequestModel) => {
                        this.updateRow(data);
                    });
            } else if (request.statusId == Credit.CreditRequestStatus.AwaitingCreditCommissionValidation) {
                this.creditRequestService.approveRequestByComission(request.id)
                    .then((data: Credit.CreditRequestModel) => {
                        this.updateRow(data);
                    });
            }
        }

        private denyRequest(request: Credit.CreditRequestModel) {
            if (request.statusId == Credit.CreditRequestStatus.AwaitingSecurityValidation ||
                request.statusId == Credit.CreditRequestStatus.AwaitingCreditCommissionValidation) {
                this.creditRequestService.denyRequest(request.id)
                    .then((data: Credit.CreditRequestModel) => {
                        this.updateRow(data);
                    });
            }
        }

        private updateRow(request: Credit.CreditRequestModel) {
            this.$scope.clientViewModel.credits.forEach((creditRequest: Credit.CreditRequestModel, index: number, array: any) => {
                if (creditRequest.id == request.id) {
                    array[index] = request;
                    return;
                }
            });
        }
    }
} 