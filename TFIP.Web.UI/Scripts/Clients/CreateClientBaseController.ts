module TFIP.Web.UI.Clients {

    export interface ICreateClientBaseScope extends MasterPage.IMasterPageScope {
        clientViewModel: ClientViewModelBase;
        countries: Shared.ListItem[];
        clientType: string;

        createUser: () => void;
        createClient: () => ng.IPromise<Shared.AjaxViewModel<any>> ;
        createClientForm: Core.ICustomFormController;
    }

    export class CreateClientBaseController extends Core.BaseController {
        constructor(
            public $scope: ICreateClientBaseScope,
            public messageBox: Core.IMessageBoxService,
            public clientService: IClientService,
            public $location: ng.ILocationService,
            public locationHelperService: Core.LocationHelperService,
            public urlBuilderService: Core.IUrlBuilderService) {
            super();
            this.init();
        }

        private init() {
            var promise = this.clientService.getClientFormViewModel().then((data: ClientFormViewModel) => {
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
            this.$scope.createUser = () => this.createUser();
        }

        private createUser() {
            if (this.$scope.createClientForm.$valid) {
                var promise = this.$scope.createClient();

                promise.then((data: Shared.AjaxViewModel<any>) => {
                    if (data.isValid) {
                        this.locationHelperService.redirect(this.urlBuilderService.buildQuery("/Clients", { clientId: data.data.id, clientType: this.$scope.clientType }));
                    } else {
                        this.messageBox.showErrorMulty(Const.Messages.clients, data.errors);
                    }
                }, (reason: any) => {
                    this.messageBox.showError(Const.Messages.clients, reason.message);
                });
            } else {
                this.makeFormDirty(this.$scope.createClientForm);

                this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
            }
        }

    }
}    