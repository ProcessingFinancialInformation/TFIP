var TFIP;
(function (TFIP) {
    var Web;
    (function (Web) {
        var UI;
        (function (UI) {
            var Filters;
            (function (Filters) {
                function offset() {
                    return function (input, start) {
                        if (input) {
                            start = parseInt(start, 10);
                            return input.slice(start);
                        }
                    };
                }
                Filters.offset = offset;
            })(Filters = UI.Filters || (UI.Filters = {}));
        })(UI = Web.UI || (Web.UI = {}));
    })(Web = TFIP.Web || (TFIP.Web = {}));
})(TFIP || (TFIP = {}));
//# sourceMappingURL=Filters.js.map