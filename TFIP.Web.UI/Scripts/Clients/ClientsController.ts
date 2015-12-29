module TFIP.Web.UI.Clients {
    import TabViewModel = TFIP.Web.UI.Shared.TabViewModel;
    import NumericConstants = TFIP.Web.UI.Const.NumericConstants;

    export interface IClientsScope extends ng.IScope {
        makeActive: (tab) => void;
        tabs: TabViewModel[];
        individualClients: ClientViewModel[];
        juridicalClients: ClientViewModel[];
        juridicalPageInfo: {};
        juridicalFilter:{};
        individualPageInfo: {};
        individualFilter: {};
        numPerPage: number;
        //matchCriteria: (filter: any) => any;
    }

    export class ClientsController {
        public static $inject = [
            "$scope",
            "clientService",
        ];

        constructor(
            private $scope: IClientsScope,
            private locationHelperService: Core.LocationHelperService,
            private messageBox: Core.IMessageBoxService,
            private clientService: IClientService,
            private paymentsService: Payments.IPaymentsService,
            private createCreditRequestService: Credit.ICreateCreditRequestService) {
            this.$scope.juridicalPageInfo = { currentPage: 1 };
            this.$scope.juridicalPageInfo = { currentPage: 1 };
            this.$scope.numPerPage = NumericConstants.itemsPerPage;
            this.init();
        }

        private init() {
            this.clientService.getJuridicalClients().then((data: Clients.ClientViewModel[]) => {
                this.$scope.juridicalClients = data;
            });
            this.clientService.getIndividualClients().then((data: Clients.ClientViewModel[]) => {
                this.$scope.individualClients = data;
            });
            this.$scope.tabs = [{ tabName: "Физические", isActive: true }, { tabName: "Юридические", isActive: false }];
            this.$scope.makeActive = (tab: TabViewModel) => this.makeActive(tab);
            //this.$scope.matchCriteria = (filter) => this.matchCriteria(filter);
        }

        private makeActive(tab) {
            this.$scope.tabs.asEnumerable().forEach((element, index) => {
                this.$scope.tabs[index].isActive = element.tabName === tab.tabName;
            });
        }

        //private matchCriteria(filter: any) {
        //    return item => {
        //        if (filter) {
        //            return item.name.indexOf(filter.name) > -1;
        //        }
        //    }
        //}
    }
}  