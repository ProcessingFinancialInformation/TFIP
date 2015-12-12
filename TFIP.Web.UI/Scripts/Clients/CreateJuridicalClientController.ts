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

            this.$scope.clientViewModel = new JuridicalClientViewModel();
            this.$scope.createClient = () => this.clientService.createJuridicalClient(<JuridicalClientViewModel>this.$scope.clientViewModel);

        }

    }
}    