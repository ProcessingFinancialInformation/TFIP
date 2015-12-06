module TFIP.Web.UI.Admin {
    
    export interface IAdminScope extends ng.IScope {
        creditTypes: Credit.CreditTypeModel[];
        creditTypePage: Credit.CreditTypePageModel;
        createCreditType: () => void;
    }

    export class AdminController {
        public static $inject = [
            "$scope",
            "creditTypeService",
            "messageBox",
            "$q"
        ];

        constructor(
            private $scope: IAdminScope,
            private creditTypeService: Credit.ICreditTypeService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService) {

            this.init();
        }

        private init() {
            this.$scope.createCreditType = () => this.createCreditType();

            var p1 = this.creditTypeService.getPage().then((data: Credit.CreditTypePageModel) => {
                this.$scope.creditTypePage = data;
            });
            var p2 = this.creditTypeService.getCreditTypes().then((data: Credit.CreditTypeModel[]) => {
                this.$scope.creditTypes = data;
            });

            this.$q.all([p1, p2])["catch"]((reason) => {
                this.messageBox.showError("Администрирование", reason.message);
            });
        }

        private createCreditType() {
            var promise = this.creditTypeService.showCreateCreditType();

            //promise["catch"]((reason: Core.IRejectionReason) => {
            //    this.messageBox.showError("Администрирование", reason.message);
            //});
        }
    }
}