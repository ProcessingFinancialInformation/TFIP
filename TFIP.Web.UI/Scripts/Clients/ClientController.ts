module TFIP.Web.UI.Clients {
    
    export interface IClientScope extends ng.IScope {
        clientViewModel: ClientViewModelBase;
        createCreditRequest: () => void;
    }

    export class ClientController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService"
        ];

        constructor(
            private $scope: IClientScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService) {

            var clientId = this.locationHelperService.getParameterValue("clientId");
            var clientType = this.locationHelperService.getParameterValue("clientType");
            
            if (clientId && clientType) {
                this.init(clientId, clientType);
            } else {
                this.messageBox.showError(Const.Messages.clients, "Идентификатор и/или тип клиента не определен").finally(() => {
                    this.locationHelperService.redirect("/Clients");
                });
            }

            this.$scope.createCreditRequest = () => this.createCreditRequest();
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
            
        }
    }
} 