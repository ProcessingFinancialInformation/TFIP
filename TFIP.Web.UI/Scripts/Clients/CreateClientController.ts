module TFIP.Web.UI.Clients {
    
    export interface ICreateClientScope extends ng.IScope {
        clientViewModel: ClientViewModel;
        createUser: () => void;

        genders: Gender;

        createClientForm: ng.IFormController;
    }

    export class CreateClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location"
        ];

        constructor(
            private $scope: ICreateClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService) {

            this.$scope.clientViewModel = new ClientViewModel();
            this.$scope.genders = new Gender();
            this.$scope.createUser = () => this.createUser();
        }

        private createUser() {
            console.log(this.$scope.clientViewModel);
        }
       
    }
}    