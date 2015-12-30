var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Credit;
            (function (Credit) {
                var NumericConstants = TFIP.Web.UI.Const.NumericConstants;
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
                        this.getCreditTypes();
                        this.$scope.createCreditType = function () { return _this.createCreditType(); };
                        this.$scope.active = function (val) {
                            return val ? 'Да' : 'Нет';
                        };
                        this.$scope.changeActivity = function (id, active) { return _this.changeActivity(id, active); };
                        this.$scope.getCreditKindName = function (kind) { return _this.getCreditKindName(kind); };
                        this.$scope.count = function (active) { return _this.count(active); };
                        this.$scope.numPerPage = NumericConstants.itemsPerPage;
                        this.$scope.currentPage = 1;
                        this.$scope.matchCriteria = function (filter) { return _this.matchCriteria(filter); };
                        this.$scope.$watch("filter", function (newVal, oldval) {
                            if (_this.$scope.creditTypes) {
                                _this.$scope.totalCount = _this.$scope.creditTypes.asEnumerable().count(function (z) { return z.name.indexOf(newVal.name) > -1 && (newVal.isActive != null ? z.isActive == newVal.isActive : true); });
                            }
                        }, true);
                        this.$scope.filter = { name: "" };
                    };
                    CreditTypesController.prototype.createCreditType = function () {
                        var _this = this;
                        var promise = this.creditTypeService.showCreateCreditType();
                        promise.then(function (data) {
                            _this.getCreditTypes();
                        });
                    };
                    CreditTypesController.prototype.getCreditTypes = function () {
                        var _this = this;
                        var p2 = this.creditTypeService.getCreditTypes().then(function (data) {
                            _this.$scope.creditTypes = data;
                            _this.$scope.totalCount = data.length;
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
                    CreditTypesController.prototype.matchCriteria = function (filter) {
                        return function (item) {
                            if (filter) {
                                return item.name.indexOf(filter.name) > -1 && (filter.isActive != null ? item.isActive === filter.isActive : true);
                            }
                        };
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
//# sourceMappingURL=CreditTypesController.js.map