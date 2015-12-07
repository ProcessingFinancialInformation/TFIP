module TFIP.Web.UI.MasterPage {

    export interface IMasterPageScope extends ng.IScope {
        regex: Const.RegularExpressions;
    }

    export class MasterPageController {
        public static $inject = [
            "$scope"
        ];

        constructor(private $scope: IMasterPageScope) {
            this.$scope.regex = new Const.RegularExpressions();
        }
    }
}  