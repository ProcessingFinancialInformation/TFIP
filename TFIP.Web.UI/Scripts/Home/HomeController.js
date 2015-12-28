var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Home;
            (function (Home) {
                var HomeController = (function () {
                    function HomeController($scope) {
                        this.$scope = $scope;
                        this.$scope.infos = ["1", "2", "3"];
                    }
                    HomeController.$inject = [
                        "$scope"
                    ];
                    return HomeController;
                })();
                Home.HomeController = HomeController;
            })(Home = UI.Home || (UI.Home = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
//# sourceMappingURL=HomeController.js.map