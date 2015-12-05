module TFIP.Web.UI.Clients {
    
    export class ClientSelectorInput {
        clientId: string;
        clientType: string;
    }

    export interface IClientsSelectorScope extends ng.IScope {
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
            "urlBuilderService"
        ];

        constructor(
            private $scope: IClientsSelectorScope,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private $location: ng.ILocationService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService) {

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
                        this.locationHelperService.redirect(this.urlBuilderService.buildQuery("clients", { clientId: data, clientType: this.$scope.clientInput.clientType }));
                        //this.$location.path("" + "/" + this.$scope.clientInput.clientId);
                    } else {
                        this.messageBox.confirm("Клиенты", "Клиента с таким идентификатором не существует. Хотите ли вы создать нового клиента?").then(() => {
                            if (this.$scope.clientInput.clientType == this.$scope.clientTypes.individualClient) {
                                window.location.href = "/Clients/CreateIndividualClient";
                            } else {
                                window.location.href = "/Clients/CreateJuridicalPersonClient";
                            }
                        });
                    }
                }, (reason: any) => {
                    this.messageBox.showError("Клиенты", reason.message);
                });
            } else {
                this.$scope.clientSelectionForm.$error.required[0].$dirty = true;
                this.messageBox.showError("Клиенты", "Введены неверные данные");
            }
        }

        
    }
}   