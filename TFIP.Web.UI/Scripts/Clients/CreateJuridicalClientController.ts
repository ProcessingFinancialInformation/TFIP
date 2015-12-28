module TFIP.Web.UI.Clients {

    export class CreateJuridicalClientController extends CreateClientBaseController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService"
        ];

        constructor(
            public $scope: ICreateClientBaseScope,
            public messageBox: Core.IMessageBoxService,
            public clientService: IClientService,
            public $location: ng.ILocationService,
            public locationHelperService: Core.LocationHelperService,
            public urlBuilderService: Core.IUrlBuilderService) {
            super($scope, messageBox, clientService, $location, locationHelperService, urlBuilderService);

            this.$scope.clientType = this.$scope.clientTypes.juridicalPerson;

            if (this.$scope.clientId) {
                var promsie = this.clientService.getClient(this.$scope.clientId, this.$scope.clientType);
                promsie.then((data: ClientViewModel) => {
                    this.$scope.clientViewModel = data;
                    this.$scope.editMode = true;
                },(reason: Core.IRejectionReason) => {
                        this.$scope.clientViewModel = new JuridicalClientViewModel();
                        this.messageBox.showError(Const.Messages.clients, reason.message);
                    });
            } else {
                this.$scope.clientViewModel = new JuridicalClientViewModel();
            }

            this.$scope.createClient = () => this.clientService.createJuridicalClient(<JuridicalClientViewModel>this.$scope.clientViewModel);

        }

    }
}    