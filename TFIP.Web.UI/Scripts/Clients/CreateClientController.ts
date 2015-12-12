module TFIP.Web.UI.Clients {
    
    export class CreateClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService",
            "$uibModalInstance"
        ];

        constructor(
            private $scope: ICreateIndividualClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {

            this.init();
        }

        private init() {
            var promsie = this.clientService.getClientFormViewModel().then((data: IndividualClientFormViewModel) => {
                this.$scope.countries = data.countries;
                this.$scope.clientViewModel = new ClientViewModel();


                this.$scope.$watch("clientViewModel", (newVal, oldVal) => {
                    for (var prop in this.$scope.clientViewModel) {

                        if (typeof (this.$scope.clientViewModel[prop]) == "string") {
                            this.$scope.clientViewModel[prop] = this.$scope.clientViewModel[prop].toUpperCase();
                        }
                    }
                }, true);
            });

            this.$scope.genders = [{ id: Gender.Male.toString(), value: "Мужской" }, { id: Gender.Female.toString(), value: "Женский" }];
            this.$scope.male = Gender.Male;
            this.$scope.female = Gender.Female;
            this.$scope.createUser = () => this.createUser();
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                this.$uibModalInstance.close(this.$scope.clientViewModel);
            } else {
                //this.$scope.createClientForm.fieldInputForm.$setDirty();

                if (this.$scope.createClientForm.$error.required) {
                    for (var i = 0; i < this.$scope.createClientForm.$error.required.length; i++) {
                        if (this.$scope.createClientForm.$error.required[i].fieldInput) {
                            this.$scope.createClientForm.$error.required[i].fieldInput.$dirty = true;
                        }
                    }
                }
                if (this.$scope.createClientForm.$error.pattern) {
                    for (var i = 0; i < this.$scope.createClientForm.$error.pattern.length; i++) {
                        if (this.$scope.createClientForm.$error.pattern[i].fieldInput) {
                            this.$scope.createClientForm.$error.pattern[i].fieldInput.$dirty = true;
                        }
                    }
                }

                this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
            }
        }

    }
}    