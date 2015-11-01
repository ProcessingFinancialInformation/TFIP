module TFIP.Web.UI.Home {
    
    export interface IHomeScope extends ng.IScope {
        infos: string[];
    }

    export class HomeController {
        public static $inject = [
            "$scope"
        ];

        constructor(private $scope: IHomeScope) {
            this.$scope.infos = ["1", "2", "3"];
        }
    }
} 