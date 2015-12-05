module TFIP.Web.UI.Clients {
    
    export interface ICreateIndividualClientScope extends ng.IScope {
        clientViewModel: ClientViewModel;
        createUser: () => void;

        male: Gender;
        female: Gender;
        genders: Shared.ListItem[];
        countries: Shared.ListItem[];

        createClientForm: ng.IFormController;
    }

    export class CreateIndividualClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService"
        ];

        constructor(
            private $scope: ICreateIndividualClientScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService) {

            this.init();
        }

        private init() {
            var promsie = this.clientService.getClientFormViewModel().then((data: IndividualClientFormViewModel) => {
                this.$scope.countries = data.countries;
            });

            promsie.then(() => {
                this.$scope.clientViewModel = new ClientViewModel();
                
                this.$scope.genders = [{ id: "male", value: "Мужской" }, { id: "female", value: "Женский" }];
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
            });
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                var promsie = this.clientService.createClient(this.$scope.clientViewModel);

                promsie.then((data: Shared.AjaxViewModel<any>) => {
                    if (data.isValid) {
                        this.locationHelperService.redirect(this.urlBuilderService.buildQuery("/Clients", { clientId: data.data.id, clientType: new ClientType().individualClient }));
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