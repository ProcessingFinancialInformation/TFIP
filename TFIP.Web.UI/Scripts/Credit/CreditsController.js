var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Credit;
            (function (Credit) {
                var CreditTypesController = (function () {
                    function CreditTypesController($scope, creditTypeService, messageBox, $q) {
                        this.$scope = $scope;
                        this.creditTypeService = creditTypeService;
                        this.messageBox = messageBox;
                        this.$q = $q;
                        this.init();
                    }
                    CreditTypesController.prototype.init = function () {
                        var _this = this;
                        this.creditTypeService.getCreditTypePage().then(function (data) {
                            _this.$scope.creditTypePage = data;
                        });
                        this.initCreditTypes();
                        this.$scope.createCreditType = function () { return _this.createCreditType(); };
                        this.$scope.active = function (val) {
                            return val ? 'Да' : 'Нет';
                        };
                        this.$scope.changeActivity = function (id, active) { return _this.changeActivity(id, active); };
                        this.$scope.getCreditKindName = function (kind) { return _this.getCreditKindName(kind); };
                        this.$scope.count = function (active) { return _this.count(active); };
                        this.$scope.pageChanged = function () {
                            console.log(_this.$scope.currentPage);
                        };
                        this.$scope.totalCount = 100;
                    };
                    CreditTypesController.prototype.createCreditType = function () {
                        var _this = this;
                        var promise = this.creditTypeService.showCreateCreditType();
                        promise.then(function (data) {
                            _this.initCreditTypes();
                        });
                    };
                    CreditTypesController.prototype.initCreditTypes = function () {
                        var _this = this;
                        var p2 = this.creditTypeService.getCreditTypes().then(function (data) {
                            _this.$scope.creditTypes = data;
                        });
                        this.$q.all([p2])["catch"](function (reason) {
                            _this.messageBox.showError(UI.Const.Messages.admin, reason.message);
                        });
                    };
                    CreditTypesController.prototype.changeActivity = function (id, active) {
                        var _this = this;
                        if (id) {
                            var promise = this.creditTypeService.changeActivity(id, active);
                            promise.then(function () {
                                var message = (active) ? UI.Const.Messages.creditTypeStatusActiveChanged : UI.Const.Messages.creditTypeStatusNotActiveChanged;
                                _this.messageBox.show(UI.Const.Messages.admin, message)["finally"](function () {
                                    var creditType = _this.$scope.creditTypes.asEnumerable().firstOrDefault(function (ct) { return ct.id == id; });
                                    creditType.isActive = active;
                                });
                            }, function (reason) {
                                _this.messageBox.showError(UI.Const.Messages.admin, reason.message);
                            });
                        }
                    };
                    CreditTypesController.prototype.getCreditKindName = function (kind) {
                        if (this.$scope.creditTypePage) {
                            return this.$scope.creditTypePage.creditKinds.asEnumerable().firstOrDefault(function (el) { return el.id == kind.toString(); }).value;
                        }
                        else {
                            return "";
                        }
                    };
                    CreditTypesController.prototype.count = function (active) {
                        if (this.$scope.creditTypes) {
                            return this.$scope.creditTypes.filter(function (t) { return t.isActive == active; }).length;
                        }
                        return 0;
                    };
                    CreditTypesController.$inject = [
                        "$scope",
                        "creditTypeService",
                        "messageBox",
                        "$q"
                    ];
                    return CreditTypesController;
                })();
                Credit.CreditTypesController = CreditTypesController;
            })(Credit = UI.Credit || (UI.Credit = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
//# sourceMappingURL=CreditsController.js.map