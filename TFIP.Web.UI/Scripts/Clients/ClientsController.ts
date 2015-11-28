module TFIP.Web.UI.Clients {
    
    export class ClientInput {
        clientId: string;
        clientType: string;
    }

    export interface IClientsScope extends ng.IScope {
        clientViewModel: ClientViewModel;
        clientTypes: ClientType;
        clientInput: ClientInput;
        getClient : () => void;
    }

    export class ClientsController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService"
        ];

        constructor(
            private $scope: IClientsScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService) {

            this.$scope.clientTypes = new ClientType();
            this.$scope.clientInput = new ClientInput();
            this.$scope.clientViewModel = null;
            this.$scope.getClient = () => this.getClient();
        }

        private getClient() {
            this.clientService.isClientExist(this.$scope.clientInput.clientId, this.$scope.clientInput.clientType);
        }
    }
}   