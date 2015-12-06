module TFIP.Web.UI.Directives {
    export interface IDateFieldInputScope extends IFieldInputScope {
        model: Date | string | number;
        inputModel: Date
    }

    export class DateFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/DateFieldInput";
        controller = DateFieldInputDirectiveController;
    }

    export class DateFieldInputDirectiveController {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IDateFieldInputScope) {
            this.$scope.inputModel = (this.$scope.model) ? new Date(<string>this.$scope.model) : null;
            this.$scope.$watch("inputModel", (newVal, oldval) => {
                if (newVal) {
                    var date = new Date(this.$scope.inputModel.toUTCString());
                    date.setMinutes(-date.getTimezoneOffset());
                    this.$scope.model = date;
                }
            });
        }
    }
}  