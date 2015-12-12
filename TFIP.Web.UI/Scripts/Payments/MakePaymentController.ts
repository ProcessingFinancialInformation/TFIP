module TFIP.Web.UI.Payments {
    export interface IMakePaymentScope extends ng.IScope {
        paymentInput: PaymentModelInput;
        makePaymentForm: ng.IFormController;
        makePayment: () => void;
    }

    export class MakePaymentController {
        public static $inject = [
            "$scope",
            "messageBox",
            "paymentsService",
            "urlBuilderService",
            "$uibModalInstance"
        ];

        constructor(
            private $scope: IMakePaymentScope,
            private messageBox: Core.IMessageBoxService,
            private paymentsService: IPaymentsService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {

            this.$scope.paymentInput = new PaymentModelInput();
            this.$scope.makePayment = () => this.makePayment();
        }

        private makePayment() {
            if (this.$scope.makePaymentForm.$valid) {
                alert('success');
            } else {
                this.$scope.makePaymentForm.$error.required[0].$dirty = true;
                this.messageBox.showError(Const.Messages.payment, Const.Messages.invalidForm);
            }
        }
    }
}