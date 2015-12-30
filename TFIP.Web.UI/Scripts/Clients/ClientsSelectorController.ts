module TFIP.Web.UI.Clients {
    
    export class ClientSelectorInput {
        clientId: string;
        clientType: string;
        clientTypes: ClientType;
    }

    export interface IClientsSelectorScope extends MasterPage.IMasterPageScope {
        clientTypes: ClientType;
        clientInput: ClientSelectorInput;
        getClient: () => void;

        clientSelectionForm: ng.IFormController;
    }

    export class ClientsSelectorController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService",
            "capabilityService"
        ];

        constructor(
            private $scope: IClientsSelectorScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService,
            private capabilityService: Capability.CapabilityService) {

            this.$scope.clientTypes = new ClientType();
            this.$scope.clientInput = new ClientSelectorInput();
            this.$scope.clientInput.clientType = this.$scope.clientTypes.individualClient;
            this.$scope.getClient = () => this.getClient();
            this.$scope.clientTypes = new ClientType();
            this.capabilityService.checkCapability("clientInformation");
        }

        private getClient() {
            if (this.$scope.clientSelectionForm.$valid) {
                var promise = this.clientService.isClientExist(this.$scope.clientInput.clientId, this.$scope.clientInput.clientType);

                promise.then((data: number) => {
                    if (data && data > 0) {
                        this.locationHelperService.redirect(this.urlBuilderService.buildQuery("clients", { clientId: data, clientType: this.$scope.clientInput.clientType }));
                    } else {
                        if (this.$scope.capabilityModel.capabilities.createIndividualClient && this.$scope.clientInput.clientType == this.$scope.clientTypes.individualClient) {
                            this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExistCreateNew).then(() => {
                                if (this.$scope.clientInput.clientType == this.$scope.clientTypes.individualClient) {
                                    window.location.href = "/Clients/CreateIndividualClient?idNo=" + this.$scope.clientInput.clientId;
                                }
                            });
                        }

                        if (!this.$scope.capabilityModel.capabilities.createIndividualClient && this.$scope.clientInput.clientType == this.$scope.clientTypes.individualClient) {
                            this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExist);
                        }

                        if (this.$scope.capabilityModel.capabilities.createJuridicalClient && this.$scope.clientInput.clientType == this.$scope.clientTypes.juridicalPerson) {
                            this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExistCreateNew).then(() => {
                                window.location.href = "/Clients/CreateJuridicalPersonClient?idNo=" + this.$scope.clientInput.clientId;
                            });
                        }

                        if (!this.$scope.capabilityModel.capabilities.createJuridicalClient && this.$scope.clientInput.clientType == this.$scope.clientTypes.juridicalPerson) {
                            this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExist);
                        }

                        //this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExistCreateNew).then(() => {
                        //    if (this.$scope.clientInput.clientType == this.$scope.clientTypes.individualClient) {
                        //        window.location.href = "/Clients/CreateIndividualClient?idNo=" + this.$scope.clientInput.clientId;
                        //    } else {
                        //        window.location.href = "/Clients/CreateJuridicalPersonClient?idNo=" + this.$scope.clientInput.clientId;
                        //    }
                        //});
                    }
                }, (reason: any) => {
                    this.messageBox.showError(Const.Messages.clients, reason.message);
                });
            } else {
                this.$scope.clientSelectionForm.$error.required[0].$dirty = true;
                this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
            }
        }

        
    }
}   