module TFIP.Web.UI.Payments {
    export interface IPaymentsService {
        showMakePayment(creditRequestId: number): ng.IPromise<number>;
        getBalanceInformation(creditRequestId: number): ng.IPromise<BalanceInformationModel>;
        makePayment(payment: PaymentViewModel): ng.IPromise<Shared.AjaxViewModel<number>>;
    }

    export class PaymentsService implements IPaymentsService {
        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService",
            "$q",
            "$uibModal"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.ApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService) {

        }

        public showMakePayment(creditRequestId: number): ng.IPromise<number> {
            var deferred = this.$q.defer();

            this.getBalanceInformation(creditRequestId).then((data: BalanceInformationModel) => {
                var modalPromise = this.$uibModal.open({
                    templateUrl: "/Payments/MakePaymentModal",
                    controller: MakePaymentController,
                    resolve: {
                        balanceInfo: () => data,
                        creditRequestId: () => creditRequestId
                    }
                });

                modalPromise.result.then((data: number) => {
                    deferred.resolve(data);
                }, (reason) => {
                    deferred.reject(reason);
                });
            });

            return deferred.promise;
        }

        public getBalanceInformation(creditRequestId: number): ng.IPromise<BalanceInformationModel> {
            return this.httpWrapper.get(this.apiUrlService.paymentsApi.getBalanceInformation + "?creditRequestId=" + creditRequestId);
        }

        public makePayment(payment: PaymentViewModel): ng.IPromise<Shared.AjaxViewModel<number>> {
            return this.httpWrapper.post(this.apiUrlService.paymentsApi.makePayment, payment);
        }
    }
}