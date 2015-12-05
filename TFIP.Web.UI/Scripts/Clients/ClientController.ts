module TFIP.Web.UI.Clients {
    
    export interface IClientScope {
        
    }

    export class ClientController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService"
        ];

        constructor(
            private $scope: ng.IScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService) {

            var clientId = this.locationHelperService.getParameterValue("clientId");
            var clientType = this.locationHelperService.getParameterValue("clientType");

            if (clientId && clientType) {
                this.init(clientId, clientType);
            } else {
                this.messageBox.showError("Клиенты", "Идентификатор и/или тип клиента не определен").finally(() => {
                    this.locationHelperService.redirect("/Clients");
                });
            }
        }

        private init(clientId: string, clientType: string) {
            this.clientService.getClient(clientId, clientType);
        }
    }
} 