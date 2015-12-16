
module TFIP.Web.UI.Clients {

    export interface ICreateIndividualClientScope extends ICreateClientBaseScope {
        genders: Shared.ListItem[];
    }

    export class CreateIndividualClientController extends CreateClientBaseController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService"
        ];

        constructor(
            public $scope: ICreateIndividualClientScope,
            public messageBox: Core.IMessageBoxService,
            public clientService: IClientService,
            public $location: ng.ILocationService,
            public locationHelperService: Core.LocationHelperService,
            public urlBuilderService: Core.IUrlBuilderService) {
            super($scope, messageBox, clientService, $location, locationHelperService, urlBuilderService);

            this.$scope.clientViewModel = new ClientViewModel();
            this.$scope.createClient = () => this.clientService.createClient(<ClientViewModel>this.$scope.clientViewModel);
            this.$scope.genders = [{ id: Gender.Male.toString(), value: "Мужской" }, { id: Gender.Female.toString(), value: "Женский" }];
        }

    }
}    