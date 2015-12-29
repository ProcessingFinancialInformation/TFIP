module TFIP.Web.UI.Credit {
    import NumericConstants = TFIP.Web.UI.Const.NumericConstants;

    export interface ICreditTypesScope extends ng.IScope {
        creditTypes: Credit.CreditTypeModel[];
        creditTypePage: Credit.CreditTypePageModel;
        createCreditType: () => void;
        active: (val: boolean) => void;
        changeActivity: (id: number, active: boolean) => void;
        getCreditKindName: (kind: number) => string;
        count: (active: boolean) => number;
        pageChanged: () => void;
        filter: {};
        currentPage: number;
        totalCount: number;
        numPerPage: number;
        matchCriteria: (filter: any) => any;
    }

    export class CreditTypesController {
        public static $inject = [
            "$scope",
            "creditTypeService",
            "messageBox",
            "$q"
        ];

        constructor(
            private $scope: ICreditTypesScope,
            private creditTypeService: Credit.ICreditTypeService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService) {

            this.init();
        }

        private init() {
            this.creditTypeService.getCreditTypePage().then((data: Credit.CreditTypePageModel) => {
                this.$scope.creditTypePage = data;
            });

            this.getCreditTypes();
            this.$scope.createCreditType = () => this.createCreditType();
            this.$scope.active = (val: boolean) => {
                return val ? 'Да' : 'Нет';
            }
            this.$scope.changeActivity = (id: number, active: boolean) => this.changeActivity(id, active);
            this.$scope.getCreditKindName = (kind: number) => this.getCreditKindName(kind);
            this.$scope.count = (active: boolean) => this.count(active);
            this.$scope.numPerPage = NumericConstants.itemsPerPage;
            this.$scope.currentPage = 1;
            this.$scope.matchCriteria = (filter) => this.matchCriteria(filter);

            this.$scope.$watch("filter", (newVal, oldval) => {
                if (this.$scope.creditTypes) {
                  this.$scope.totalCount = this.$scope.creditTypes.asEnumerable().count(z => z.name.indexOf(newVal.name) > -1 && (newVal.isActive != null? z.isActive == newVal.isActive: true));
                }
            }, true);

            this.$scope.filter = { name: "" };
        }

        private createCreditType() {
            var promise = this.creditTypeService.showCreateCreditType();

            promise.then((data: any) => {
                this.getCreditTypes();
            });
        }



        private getCreditTypes() {
            var p2 = this.creditTypeService.getCreditTypes().then((data: Credit.CreditTypeModel[]) => {
                this.$scope.creditTypes = data;
                this.$scope.totalCount = data.length;
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

        private matchCriteria(filter: any) {
            return item => {
                if (filter) {
                    return item.name.indexOf(filter.name) > -1 &&( filter.isActive != null? item.isActive === filter.isActive : true);
                }
            }
        }
    }
} 