module TFIP.Web.UI.Clients {

    export interface ICreateClientBaseScope extends MasterPage.IMasterPageScope {
        clientViewModel: ClientViewModelBase;
        countries: Shared.ListItem[];
        clientType: string;
        clientTypes: ClientType;
        clientId: string;
        editMode: boolean;

        createUser: () => void;
        createClient: () => ng.IPromise<Shared.AjaxViewModel<any>> ;
        createClientForm: Core.ICustomFormController;
        today: Date;
        min18AgeDate: Date;
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
            this.$scope.clientId = this.locationHelperService.getParameterValue("clientId");

            var clientFormPromise: ng.IPromise<ClientFormViewModel>;

            clientFormPromise = this.clientService.getClientFormViewModel();
            clientFormPromise.then((data: ClientFormViewModel) => {
                this.$scope.countries = data.countries;
            });
            this.$scope.$watch("clientViewModel",(newVal, oldVal) => {
                for (var prop in this.$scope.clientViewModel) {
                    if (typeof (this.$scope.clientViewModel[prop]) == "string") {
                        this.$scope.clientViewModel[prop] = this.$scope.clientViewModel[prop].toUpperCase();
                    }
                }
            }, true);
            this.$scope.clientTypes = new ClientType();
            this.$scope.createUser = () => this.createUser();
            this.$scope.today = moment();
            this.$scope.min18AgeDate = moment().subtract("years", 18);
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