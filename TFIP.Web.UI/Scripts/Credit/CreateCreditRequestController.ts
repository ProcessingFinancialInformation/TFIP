module TFIP.Web.UI.Credit {
    export interface ICreateCreditRequestScope extends ng.IScope {
        
    }

    export class CreateCreditRequestController {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: ICreateCreditRequestScope) {
            
        }
    }
} 