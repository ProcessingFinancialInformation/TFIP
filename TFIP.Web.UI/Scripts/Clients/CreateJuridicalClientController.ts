module TFIP.Web.UI.Clients {

    export interface ICreateJuridicalClientScope extends MasterPage.IMasterPageScope {
        clientViewModel: JuridicalClientViewModel;
        countries: Shared.ListItem[];

        createUser: () => void;
        createClientForm: ng.IFormController;
    }

    export class CreateJuridicalClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService"
        ];

        constructor(
            private $scope: ICreateJuridicalClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService) {

            this.clientService.getClientFormViewModel().then((data: IndividualClientFormViewModel) => {
                this.$scope.countries = data.countries;
            });

            this.$scope.clientViewModel = new JuridicalClientViewModel();
            this.$scope.createUser = () => this.createUser();

            this.$scope.$watch("clientViewModel",(newVal, oldVal) => {
                for (var prop in this.$scope.clientViewModel) {

                    if (typeof (this.$scope.clientViewModel[prop]) == "string") {
                        this.$scope.clientViewModel[prop] = this.$scope.clientViewModel[prop].toUpperCase();
                    }
                }
            }, true);
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                var promsie = this.clientService.createJuridicalClient(this.$scope.clientViewModel);

                promsie.then((data: Shared.AjaxViewModel<any>) => {
                    if (data.isValid) {
                        this.locationHelperService.redirect(this.urlBuilderService.buildQuery("/Clients", { clientId: data.data.id, clientType: new ClientType().juridicalPerson }));
                    } else {
                        this.messageBox.showErrorMulty(Const.Messages.clients, data.errors);
                    }
                }, (reason: any) => {
                    this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
                });
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