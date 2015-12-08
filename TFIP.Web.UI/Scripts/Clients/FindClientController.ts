module TFIP.Web.UI.Clients {
    
    export class FindClientController {
        public static $inject = [
            "$scope",
            "messageBox",
            "clientService",
            "$location",
            "locationHelperService",
            "urlBuilderService",
            "$uibModalInstance"
        ];

        constructor(
            private $scope: IClientsSelectorScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {

            this.$scope.clientTypes = new ClientType();
            this.$scope.clientInput = new ClientSelectorInput();
            this.$scope.clientInput.clientType = this.$scope.clientTypes.individualClient;
            this.$scope.getClient = () => this.getClient();
        }

        private getClient() {
            if (this.$scope.clientSelectionForm.$valid) {
                var promise = this.clientService.isClientExist(this.$scope.clientInput.clientId, this.$scope.clientInput.clientType);

                promise.then((data: number) => {
                    if (data && data > 0) {
                        var promise = this.clientService.getClient(data.toString(), this.$scope.clientInput.clientType);

                        promise.then((data: ClientViewModel) => {
                            this.$uibModalInstance.close(data);
                        }, (reason: Core.IRejectionReason) => {
                            this.messageBox.showError(Const.Messages.clients, reason.message);
                        });

                        //this.$location.path("" + "/" + this.$scope.clientInput.clientId);
                    } else {

                        this.messageBox.confirm(Const.Messages.clients, Const.Messages.clientNotExist).then(() => {
                            this.$uibModalInstance.dismiss(this.$scope.clientInput.clientType);
                        });
                    }
                },(reason: any) => {
                        this.messageBox.showError(Const.Messages.clients, reason.message);
                    });
            } else {
                this.$scope.clientSelectionForm.$error.required[0].$dirty = true;
                this.messageBox.showError(Const.Messages.clients, Const.Messages.invalidForm);
            }
        }


    }
}   