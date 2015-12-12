module TFIP.Web.UI.Clients {
    
    export class CreateClientController extends Core.BaseController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService",
            "$uibModalInstance",
            "clientModel"
        ];

        constructor(
            private $scope: ICreateIndividualClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private clientModel: ClientViewModel) {
            super();
            this.init();
        }

        private init() {
            var promsie = this.clientService.getClientFormViewModel().then((data: IndividualClientFormViewModel) => {
                this.$scope.countries = data.countries;
                if (this.clientModel) {
                    this.$scope.clientViewModel = this.clientModel;
                } else {
                    this.$scope.clientViewModel = new ClientViewModel();
                }


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
            this.$scope.regex = new Const.RegularExpressions();
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                this.$uibModalInstance.close(this.$scope.clientViewModel);
            } else {
                //this.$scope.createClientForm.fieldInputForm.$setDirty();
                this.makeFormDirty(this.$scope.createClientForm);

                this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
            }
        }

    }
}    