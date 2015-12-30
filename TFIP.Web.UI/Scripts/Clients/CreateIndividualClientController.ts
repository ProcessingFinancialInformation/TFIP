
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
            "urlBuilderService",
            "capabilityService",
            "settingsService"
        ];

        constructor(
            public $scope: ICreateIndividualClientScope,
            public messageBox: Core.IMessageBoxService,
            public clientService: IClientService,
            public $location: ng.ILocationService,
            public locationHelperService: Core.LocationHelperService,
            public urlBuilderService: Core.IUrlBuilderService,
            public capabilityService: Capability.ICapabilityService,
            public settingsService: Settings.ISettingsService) {
            super($scope, messageBox, clientService, $location, locationHelperService, urlBuilderService, settingsService);
            this.capabilityService.checkCapability("createIndividualClient").then(() => {
                this.initialize();
            });
            
        }

        private initialize() {
            this.$scope.clientType = this.$scope.clientTypes.individualClient;
            if (this.$scope.clientId) {
                var promsie = this.clientService.getClient(this.$scope.clientId, this.$scope.clientType);
                promsie.then((data: ClientViewModel) => {
                    this.$scope.clientViewModel = data;
                    this.$scope.editMode = true;
                },(reason: Core.IRejectionReason) => {
                        this.$scope.clientViewModel = new ClientViewModel();
                        this.messageBox.showError(Const.Messages.clients, reason.message);
                    });
            } else {
                this.$scope.clientViewModel = new ClientViewModel();
                if (this.$scope.idNo) {
                    this.$scope.clientViewModel.identificationNo = this.$scope.idNo;
                }
            }

            this.$scope.createClient = () => this.clientService.createClient(<ClientViewModel>this.$scope.clientViewModel);
            this.$scope.genders = [{ id: Gender.Male.toString(), value: "Мужской" }, { id: Gender.Female.toString(), value: "Женский" }];
        }

    }
}    