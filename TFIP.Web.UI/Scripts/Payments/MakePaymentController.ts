module TFIP.Web.UI.Payments {
    export interface IMakePaymentScope extends ng.IScope {
        paymentViewModel: PaymentViewModel;
        balanceInfo: BalanceInformationModel;
        makePaymentForm: Core.ICustomFormController
        makePayment: () => void;
    }

    export class MakePaymentController extends Core.BaseController {
        public static $inject = [
            "$scope",
            "messageBox",
            "paymentsService",
            "urlBuilderService",
            "$uibModalInstance",
            "balanceInfo",
            "creditRequestId"
        ];

        constructor(
            private $scope: IMakePaymentScope,
            private messageBox: Core.IMessageBoxService,
            private paymentsService: IPaymentsService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private balanceInfo: BalanceInformationModel,
            private creditRequestId: number) {
            super();
            this.$scope.paymentViewModel = new PaymentViewModel();
            this.$scope.paymentViewModel.creditRequestId = creditRequestId;
            this.$scope.makePayment = () => this.makePayment();
            this.$scope.balanceInfo = balanceInfo;
        }

        private makePayment() {
            if (this.$scope.makePaymentForm.$valid) {
                var promise = this.paymentsService.makePayment(this.$scope.paymentViewModel);
                promise.then((data: Shared.AjaxViewModel<number>) => {
                    if (data.isValid) {
                        this.$uibModalInstance.close(data.data);
                    } else {
                        this.messageBox.showErrorMulty(Const.Messages.payment, data.errors);
                    }
                }, (reason: Core.IRejectionReason) => {
                    if (!reason.aborted) {
                        this.messageBox.showError(Const.Messages.payment, reason.message);
                    }
                });
            } else {
                this.makeFormDirty(this.$scope.makePaymentForm);
                this.messageBox.showError(Const.Messages.payment, Const.Messages.invalidForm);
            }
        }
    }
}