var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Admin;
            (function (Admin) {
                var NumericConstants = TFIP.Web.UI.Const.NumericConstants;
                var AdminClientsController = (function () {
                    function AdminClientsController($scope, clientService) {
                        this.$scope = $scope;
                        this.clientService = clientService;
                        this.$scope.juridicalPageInfo = { currentPage: 1, totalItems: 0 };
                        this.$scope.individualPageInfo = { currentPage: 1, totalItems: 0 };
                        this.$scope.numPerPage = NumericConstants.itemsPerPage;
                        this.init();
                    }
                    AdminClientsController.prototype.init = function () {
                        var _this = this;
                        this.clientService.getJuridicalClients().then(function (data) {
                            _this.$scope.juridicalClients = data;
                            _this.$scope.juridicalPageInfo.totalItems = data.length;
                        });
                        this.clientService.getIndividualClients().then(function (data) {
                            _this.$scope.individualClients = data;
                            _this.$scope.individualPageInfo.totalItems = data.length;
                        });
                        this.$scope.tabs = [{ tabName: "Физические", isActive: true }, { tabName: "Юридические", isActive: false }];
                        this.$scope.makeActive = function (tab) { return _this.makeActive(tab); };
                        this.$scope.$watch("individualFilter", function (newVal, oldval) {
                            if (_this.$scope.individualClients) {
                                _this.$scope.individualPageInfo.totalItems = _this.$scope.individualClients.asEnumerable().count(function (z) { return z.name.indexOf(newVal.name) > -1; });
                            }
                        });
                        this.$scope.$watch("juridicalFilter", function (newVal, oldval) {
                            if (_this.$scope.juridicalClients) {
                                _this.$scope.juridicalPageInfo.totalItems = _this.$scope.juridicalClients.asEnumerable().count(function (z) { return z.name.indexOf(newVal.name) > -1; });
                            }
                        });
                    };
                    AdminClientsController.prototype.makeActive = function (tab) {
                        var _this = this;
                        this.$scope.tabs.asEnumerable().forEach(function (element, index) {
                            _this.$scope.tabs[index].isActive = element.tabName === tab.tabName;
                        });
                    };
                    AdminClientsController.$inject = [
                        "$scope",
                        "clientService",
                    ];
                    return AdminClientsController;
                })();
                Admin.AdminClientsController = AdminClientsController;
            })(Admin = UI.Admin || (UI.Admin = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
//# sourceMappingURL=AdminClientsController.js.map