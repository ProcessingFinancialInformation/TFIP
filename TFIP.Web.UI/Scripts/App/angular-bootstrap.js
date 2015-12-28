/// <reference path="../_references.ts" />
var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Bootstrap;
            (function (Bootstrap) {
                $(function () {
                    //if (!window.console) window.console = new Console();
                    bootstrapAngularApp();
                    function bootstrapAngularApp() {
                        var modules = [
                            Bootstrap.ModuleBootstrapper.main([])
                        ];
                        $.each(modules, function (_, m) { return m.bootstrap(); });
                    }
                });
            })(Bootstrap = UI.Bootstrap || (UI.Bootstrap = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
