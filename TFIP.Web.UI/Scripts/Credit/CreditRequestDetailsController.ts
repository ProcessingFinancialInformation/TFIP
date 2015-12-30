module TFIP.Web.UI.Credit {
    import NumericConstants = TFIP.Web.UI.Const.NumericConstants;

    export interface ICreditRequestDetailsScope extends ng.IScope {
        creditRequest: CreditRequestModel;
        balanceInfo: Payments.BalanceInformationModel;
        downloadAttachment: (attachment: Shared.ListItem) => void;
        concatCurrency: (str: string) => string;
        currentPage: number;
        totalItems: number;
        numPerPage: number;

        numPages: number;
    }

    export class CreditRequestDetailsController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "creditRequest",
            "balanceInfo",
            "messageBox",
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService"
        ];

        constructor(
            private $scope: ICreditRequestDetailsScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private creditRequest: CreditRequestModel,
            private balanceInfo: Payments.BalanceInformationModel,
            private messageBox: Core.IMessageBoxService,
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.IApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService) {

            this.$scope.creditRequest = creditRequest;
            this.$scope.totalItems = creditRequest.payments.length;
            this.$scope.balanceInfo = balanceInfo;
            console.log(creditRequest);
            console.log(balanceInfo);
            this.$scope.downloadAttachment = (attachment: Shared.ListItem) => this.downloadAttachment(attachment);
            this.$scope.concatCurrency = (str: string) => this.concatCurrency(str);
            this.$scope.numPerPage = NumericConstants.itemsPerPage;
            this.$scope.currentPage = 1;
            this.$scope.numPages = 6;
        }

        private downloadAttachment(attachment: Shared.ListItem) {
            if (attachment) {
                var url = this.urlBuilderService.buildQuery(this.apiUrlService.attachmentApi.download, { id: attachment.id, value: attachment.value });
                this.httpWrapper.download(url);
            }
        }

        private concatCurrency(str: string) {
            return str + ' ' + this.$scope.creditRequest.creditType.displayCurrency;
        }
    }

    
} 