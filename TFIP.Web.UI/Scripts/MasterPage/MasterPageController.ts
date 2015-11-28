module TFIP.Web.UI.MasterPage {

    export interface IMasterPageScope extends ng.IScope {
    }

    export class MasterPageController {
        public static $inject = [
            "$scope"
        ];

        constructor(private $scope: IMasterPageScope) {
        }
    }
}  