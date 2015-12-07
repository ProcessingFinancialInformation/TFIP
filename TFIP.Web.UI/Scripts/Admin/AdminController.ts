module TFIP.Web.UI.Admin {
    
    export interface IAdminScope extends ng.IScope {
        creditTypes: Credit.CreditTypeModel[];
        creditTypePage: Credit.CreditTypePageModel;
        createCreditType: () => void;
        active: (val: boolean) => void;
        changeActivity: (id: number, active: boolean, index: number) => void;
        getCreditKindName: (kind: number) => string;
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
            this.creditTypeService.getCreditTypePage().then((data: Credit.CreditTypePageModel) => {
                this.$scope.creditTypePage = data;
            });

            this.initCreditTypes();
            this.$scope.createCreditType = () => this.createCreditType();
            this.$scope.active = (val: boolean) => {
                return val ? 'Да' : 'Нет';
            }
            this.$scope.changeActivity = (id: number, active: boolean, index: number) => this.changeActivity(id, active, index);
            this.$scope.getCreditKindName = (kind: number) => this.getCreditKindName(kind);
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

        private changeActivity(id: number, active: boolean, index: number) {
            if (id) {
                var promise = this.creditTypeService.changeActivity(id, active);
                promise.then(() => {
                    var message = (active) ? Const.Messages.creditTypeStatusActiveChanged : Const.Messages.creditTypeStatusNotActiveChanged;
                    this.messageBox.show(Const.Messages.admin, message)["finally"](() => {
                        this.$scope.creditTypes[index].isActive = active;
                    });
                    
                },(reason: Core.IRejectionReason) => {
                        this.messageBox.showError(Const.Messages.admin, reason.message);
                });
            }
        }

        private getCreditKindName(kind: number) {
            if (this.$scope.creditTypePage) {
                return this.$scope.creditTypePage.creditKinds.asEnumerable().firstOrDefault((el: Shared.ListItem) => { return el.id == kind.toString(); }).value;
            } else {
                return "";
            }
        }
    }
}