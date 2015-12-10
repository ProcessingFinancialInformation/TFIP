module TFIP.Web.UI.Payments {
    export interface IPaymentsService {
        showMakePayment(creditRequestId: number): ng.IPromise<PaymentViewModel>;
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

        showMakePayment(creditRequestId: number): ng.IPromise<PaymentViewModel> {
            var deferred = this.$q.defer();

            var modalPromise = this.$uibModal.open({
                templateUrl: "/Payments/MakePaymentModal",
                controller: MakePaymentController
            });

            modalPromise.result.then((data: PaymentViewModel) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }
    }
}