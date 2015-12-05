module TFIP.Web.UI.Clients {

    export interface ICreateJuridicalClientScope extends ng.IScope {
        clientViewModel: ClientViewModel;

        createUser: () => void;
        createClientForm: ng.IFormController;
    }

    export class CreateJuridicalClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location"
        ];

        constructor(
            private $scope: ICreateJuridicalClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService) {

            this.$scope.clientViewModel = new ClientViewModel();
            this.$scope.createUser = () => this.createUser();

            this.$scope.$watch("clientViewModel",(newVal, oldVal) => {
            }, true);
        }

        private createUser() {
        }

    }
}    