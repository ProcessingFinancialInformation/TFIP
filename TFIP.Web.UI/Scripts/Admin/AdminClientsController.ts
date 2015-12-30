module TFIP.Web.UI.Admin {
    import TabViewModel = TFIP.Web.UI.Shared.TabViewModel;
    import NumericConstants = TFIP.Web.UI.Const.NumericConstants;
    import PageInfoViewModel = TFIP.Web.UI.Shared.PageInfoViewModel;
    import ClientViewModel = TFIP.Web.UI.Clients.ClientViewModel;
    import ClientService = TFIP.Web.UI.Clients.IClientService;

    export interface IClientsScope extends ng.IScope {
        makeActive: (tab) => void;
        tabs: TabViewModel[];
        individualClients: ClientViewModel[];
        juridicalClients: ClientViewModel[];
        juridicalPageInfo: PageInfoViewModel;
        juridicalFilter: {};
        individualPageInfo: PageInfoViewModel;
        individualFilter: {};
        numPerPage: number;
    }

    export class AdminClientsController {
        public static $inject = [
            "$scope",
            "locationHelperService",
            "messageBox",
            "clientService"
        ];

        constructor(
            private $scope: IClientsScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: ClientService) {
            this.$scope.juridicalPageInfo = { currentPage: 1, totalItems: 0 };
            this.$scope.individualPageInfo = { currentPage: 1, totalItems: 0 };
            this.$scope.numPerPage = NumericConstants.itemsPerPage;
            this.init();
        }

        private init() {
            this.clientService.getJuridicalClients().then((data: Clients.ClientViewModel[]) => {
                this.$scope.juridicalClients = data;
                this.$scope.juridicalPageInfo.totalItems = data.length;
            });
            this.clientService.getIndividualClients().then((data: Clients.ClientViewModel[]) => {
                this.$scope.individualClients = data;
                this.$scope.individualPageInfo.totalItems = data.length;
            });
            this.$scope.tabs = [{ tabName: "Физические", isActive: true }, { tabName: "Юридические", isActive: false }];
            this.$scope.makeActive = (tab: TabViewModel) => this.makeActive(tab);
            this.$scope.$watch("individualFilter", (newVal, oldval) => {
                if (this.$scope.individualClients) {
                    this.$scope.individualPageInfo.totalItems = this.$scope.individualClients.asEnumerable().count(z => z.name.indexOf(newVal.name) > -1);
                }
            },true);
            this.$scope.$watch("juridicalFilter", (newVal, oldval) => {
                if (this.$scope.juridicalClients) {
                    this.$scope.juridicalPageInfo.totalItems = this.$scope.juridicalClients.asEnumerable().count(z => z.name.indexOf(newVal.name) > -1);
                }
            },true);
        }

        private makeActive(tab) {
            this.$scope.tabs.asEnumerable().forEach((element, index) => {
                this.$scope.tabs[index].isActive = element.tabName === tab.tabName;
            });
        }
    }
}  