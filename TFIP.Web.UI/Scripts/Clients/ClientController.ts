module TFIP.Web.UI.Clients {
    export interface IClientScope extends ng.IScope {
        clientViewModel: ClientViewModelBase;
        createCreditRequest: () => void;
        clientType: string;
        makePayment: (request: Credit.CreditRequestModel) => void;
        getCreditRequestDetails: () => void;
        clientTypes: ClientType;
        getClientName: () => string;
        canMakePayment: (request: Credit.CreditRequestModel) => boolean;
    }

    export class ClientController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService",
            "paymentsService",
            "createCreditRequestService"
        ];

        constructor(
            private $scope: IClientScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private paymentsService: Payments.IPaymentsService,
            private createCreditRequestService: Credit.ICreateCreditRequestService) {

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
            this.$scope.getCreditRequestDetails = () => this.getCreditRequestDetails();
            this.$scope.clientTypes = new ClientType();
            this.$scope.getClientName = () => this.getClientName();
            this.$scope.canMakePayment = (request: Credit.CreditRequestModel) => this.canMakePayment(request);
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
            this.createCreditRequestService.showCreateCreditPopup(this.$scope.clientViewModel.id, this.$scope.clientType).then((data: Credit.CreditRequestModel) => {
                if (data) {
                    this.$scope.clientViewModel.credits.push(data);
                }
            });
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

        private getCreditRequestDetails() {
            alert('credit request details');
        }

        private canMakePayment(request: Credit.CreditRequestModel): boolean {
            return request.statusId == Credit.CreditRequestStatus.InProgress;
        }
    }
} 