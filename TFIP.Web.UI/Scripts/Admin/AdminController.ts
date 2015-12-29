module TFIP.Web.UI.Admin {
    import TabViewModel = TFIP.Web.UI.Shared.TabViewModel;

    export interface IAdminScope extends ng.IScope {
        makeActive: (tab)=> void ;
        tabs: TabViewModel[];
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
            this.$scope.tabs = [{ tabName: "Кредиты", isActive: true }, { tabName: "Клиенты", isActive: false }];
            this.$scope.makeActive = (tab: TabViewModel) => this.makeActive(tab);
        }

        private makeActive(tab) {
            this.$scope.tabs.asEnumerable().forEach((element, index) => {
                this.$scope.tabs[index].isActive = element.tabName === tab.tabName;
            });
        }
    }
}