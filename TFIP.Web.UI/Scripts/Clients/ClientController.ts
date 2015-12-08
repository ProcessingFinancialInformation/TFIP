module TFIP.Web.UI.Clients {
    
    export interface IClientScope extends ng.IScope {
        clientViewModel: ClientViewModelBase;
        createCreditRequest: () => void;
        clientType: string;
        makePayment: () => void;
        getCreditRequestDetails: () => void;

    }

    export class ClientController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService",
            "createCreditRequestService"
        ];

        constructor(
            private $scope: IClientScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
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
            this.$scope.makePayment = () => this.makePayment();
            this.$scope.getCreditRequestDetails = () => this.getCreditRequestDetails();
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
            this.createCreditRequestService.showCreateCreditPopup(this.$scope.clientViewModel.id, this.$scope.clientType);
        }

        private makePayment() {
            alert('make payment');
        }

        private getCreditRequestDetails() {
            alert('credit request details');
        }
    }
} 