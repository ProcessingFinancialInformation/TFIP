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
            this.initCreditTypes();
            this.$scope.createCreditType = () => this.createCreditType();
        }

        private createCreditType() {
            var promise = this.creditTypeService.showCreateCreditType();

            promise.then((data: any) => {
                this.initCreditTypes();
            });
        }

        private initCreditTypes() {
            var p2 = this.creditTypeService.getCreditTypes().then((data: Credit.CreditTypeModel[]) => {
                this.$scope.creditTypes = data;
            });

            this.$q.all([p2])["catch"]((reason) => {
                this.messageBox.showError(Const.Messages.admin, reason.message);
            });
        }
    }
}