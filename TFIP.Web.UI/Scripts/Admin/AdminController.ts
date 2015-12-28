module TFIP.Web.UI.Admin {
    
    export interface IAdminScope extends ng.IScope {
        creditTypes: Credit.CreditTypeModel[];
        creditTypePage: Credit.CreditTypePageModel;
        createCreditType: () => void;
        active: (val: boolean) => void;
        changeActivity: (id: number, active: boolean) => void;
        getCreditKindName: (kind: number) => string;
        count: (active: boolean) => number;
        pageChanged: () => void;
        currentPage: number;
        totalCount: number;
    }

    export class AdminController {
        public static $inject = [
            "$scope",
            "creditTypeService",
            "messageBox",
            "$q",
            "capabilityService"
        ];

        constructor(
            private $scope: IAdminScope,
            private creditTypeService: Credit.ICreditTypeService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private capabilityService: Capability.ICapabilityService) {

            this.capabilityService.checkCapability("adminPermissions").then(() => {
                this.init();
            });
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
            this.$scope.changeActivity = (id: number, active: boolean) => this.changeActivity(id, active);
            this.$scope.getCreditKindName = (kind: number) => this.getCreditKindName(kind);
            this.$scope.count = (active: boolean) => this.count(active);
            this.$scope.pageChanged = () => {
                console.log(this.$scope.currentPage);
            }
            this.$scope.totalCount = 100;
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

        private changeActivity(id: number, active: boolean) {
            if (id) {
                var promise = this.creditTypeService.changeActivity(id, active);
                promise.then(() => {
                    var message = (active) ? Const.Messages.creditTypeStatusActiveChanged : Const.Messages.creditTypeStatusNotActiveChanged;
                    this.messageBox.show(Const.Messages.admin, message)["finally"](() => {
                        var creditType = this.$scope.creditTypes.asEnumerable().firstOrDefault((ct) => { return ct.id == id; });
                        creditType.isActive = active;
                    });
                }, (reason: Core.IRejectionReason) => {
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

        private count(active: boolean) {
            if (this.$scope.creditTypes) {
                return this.$scope.creditTypes.filter((t) => t.isActive == active).length;
            }

            return 0;
        }
    }
}