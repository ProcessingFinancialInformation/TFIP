module TFIP.Web.UI.Credit {
    export interface ICreditRequestDetailsScope extends ng.IScope {
        creditRequest: CreditRequestModel;
        downloadAttachment: (attachment: Shared.ListItem) => void;
    }

    export class CreditRequestDetailsController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "creditRequest",
            "messageBox",
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService"
        ];

        constructor(
            private $scope: ICreditRequestDetailsScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private creditRequest: CreditRequestModel,
            private messageBox: Core.IMessageBoxService,
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.IApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService) {

            this.$scope.creditRequest = creditRequest;
            this.$scope.downloadAttachment = (attachment: Shared.ListItem) => this.downloadAttachment(attachment);
        }

        private downloadAttachment(attachment: Shared.ListItem) {
            if (attachment) {
                var url = this.urlBuilderService.buildQuery(this.apiUrlService.attachmentApi.download, { id: attachment.id, value: attachment.value });
                this.httpWrapper.download(url);
            }
        }

    }
} 