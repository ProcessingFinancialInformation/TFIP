module TFIP.Web.UI.Clients {
    
    export interface ICreateClientScope extends ng.IScope {
        clientViewModel: ClientViewModel;
        createUser: () => void;

        male: Gender;
        female: Gender;

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
            this.$scope.male = Gender.Male;
            this.$scope.female = Gender.Female;
            this.$scope.createUser = () => this.createUser();

            this.$scope.$watch("clientViewModel", (newVal, oldVal) => {
                for (var prop in this.$scope.clientViewModel) {
                    
                    if (typeof (this.$scope.clientViewModel[prop]) == "string") {
                        this.$scope.clientViewModel[prop] = this.$scope.clientViewModel[prop].toUpperCase();
                    }
                }
            }, true);
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                var promsie = this.clientService.createClient(this.$scope.clientViewModel);

                promsie.then((data: Shared.AjaxViewModel<any>) => {
                    if (data.isValid) {
                        window.location.href = '/';
                    } else {
                        this.messageBox.showErrorMulty("Клиенты", data.errors);
                    }
                }, (reason: any) => {
                    this.messageBox.showError("Клиенты", reason.message);
                });
            } else {
                for (var i = 0; i < this.$scope.createClientForm.$error.required.length; i++) {
                    this.$scope.createClientForm.$error.required[i].$dirty = true;
                }
                this.messageBox.showError("Клиенты", "Введены неверные данные");
            }
        }
       
    }
}    