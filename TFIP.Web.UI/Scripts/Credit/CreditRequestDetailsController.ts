module TFIP.Web.UI.Credit {
    export interface ICreditRequestDetailsScope extends ng.IScope {
        creditRequest: CreditRequestModel;
    }

    export class CreditRequestDetailsController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "creditRequest",
            "messageBox"
        ];

        constructor(
            private $scope: ICreditRequestDetailsScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private creditRequest: CreditRequestModel,
            private messageBox: Core.IMessageBoxService) {

            this.$scope.creditRequest = creditRequest;
            console.log(this.$scope.creditRequest);
        }

    }
} 