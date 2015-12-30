module TFIP.Web.UI.Admin {
    import TabViewModel = TFIP.Web.UI.Shared.TabViewModel;

    export interface IAdminScope extends ng.IScope {
        makeActive: (tab)=> void ;
        tabs: TabViewModel[];
        regex: Const.RegularExpressions;
        numPages: number;
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

            this.$scope.numPages = 6;
            this.capabilityService.checkCapability("adminPermissions").then(() => {
                this.init();
            });
        }

        private init() {
            this.$scope.tabs = [
                { tabName: "Кредиты", isActive: true },
                { tabName: "Клиенты", isActive: false },
                { tabName: "Настройки", isActive: false }
            ];
            this.$scope.makeActive = (tab: TabViewModel) => this.makeActive(tab);
            this.$scope.regex = new Const.RegularExpressions();
        }

        private makeActive(tab) {
            this.$scope.tabs.asEnumerable().forEach((element, index) => {
                this.$scope.tabs[index].isActive = element.tabName === tab.tabName;
            });
        }
    }
}