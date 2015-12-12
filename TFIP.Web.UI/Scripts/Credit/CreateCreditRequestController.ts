module TFIP.Web.UI.Credit {
    export interface ICreateCreditRequestScope extends ng.IScope {
        creditRequestModel: CreditRequestModel;
        addGuarantor: () => void;
    }

    export class CreateCreditRequestController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "messageBox",
            "clientService"
        ];

        constructor(
            private $scope: ICreateCreditRequestScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private messageBox: Core.IMessageBoxService,
            private clientService: Clients.IClientService) {

            this.$scope.creditRequestModel = new CreditRequestModel();
            this.$scope.addGuarantor = () => this.addGuarantor();
        }

        private addGuarantor() {
            this.clientService.showFindClients().then((data: Clients.ClientViewModel) => {
                this.pushGuarantor(data);
                console.log(this.$scope.creditRequestModel);
            }, (data: string) => {
                this.clientService.showCreateClients(data).then((data: Clients.ClientViewModel) => {
                    this.pushGuarantor(data);
                });
            });
        }

        private pushGuarantor(data: Clients.ClientViewModel) {
            if (data) {
                console.log(data);
                if (!this.$scope.creditRequestModel.guarantors) {
                    this.$scope.creditRequestModel.guarantors = [];
                }
                this.$scope.creditRequestModel.guarantors.push(data);
            }
        }
    }
} 