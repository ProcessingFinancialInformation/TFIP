var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Bootstrap;
            (function (Bootstrap) {
                var ModuleBootstrapper = (function () {
                    function ModuleBootstrapper(module, rootElementSelector) {
                        this.module = module;
                        this.rootElementSelector = rootElementSelector;
                    }
                    ModuleBootstrapper.prototype.register = function (updatedElements) {
                        if (this.needsUpdate(updatedElements)) {
                            if (this.registered) {
                                this.dispose();
                            }
                            this.bootstrap();
                        }
                    };
                    ModuleBootstrapper.prototype.bootstrap = function () {
                        var $element = $(this.rootElementSelector);
                        angular.bootstrap($element, [this.module.name]);
                        this.scope = $element.scope();
                        this.registered = true;
                    };
                    ModuleBootstrapper.prototype.needsUpdate = function (updatedElements) {
                        if (!this.rootElementSelector) {
                            return false;
                        }
                        var element = $(this.rootElementSelector).get(0);
                        if (!element) {
                            return false;
                        }
                        return updatedElements.length == 0 || Enumerable.from(updatedElements).any(function (panel) { return $.contains(panel, element); });
                    };
                    ModuleBootstrapper.prototype.dispose = function () {
                        if (this.scope) {
                            this.scope.$destroy();
                        }
                    };
                    ModuleBootstrapper.main = function (modules) {
                        var modulesNames = modules.asEnumerable().select(function (m, index) {
                            return m.module.name;
                        }).toArray();
                        modulesNames = modulesNames.concat([]);
                        var mainModule = angular.module("TFIP.Web.UI", modulesNames).controller("HomeController", TFIP.Web.UI.Home.HomeController);
                        return new ModuleBootstrapper(mainModule, "body");
                    };
                    return ModuleBootstrapper;
                })();
                Bootstrap.ModuleBootstrapper = ModuleBootstrapper;
            })(Bootstrap = UI.Bootstrap || (UI.Bootstrap = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
//# sourceMappingURL=ModuleBootstrapper.js.map