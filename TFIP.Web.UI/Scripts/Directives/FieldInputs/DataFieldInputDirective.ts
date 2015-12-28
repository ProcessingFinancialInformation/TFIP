module TFIP.Web.UI.Directives {
    export interface IDateFieldInputScope extends IFieldInputScope {
        model: Date | string | number;
        inputModel: Date
        minDate: Date;
        maxDate: Date;
    }

    export class DateFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/DateFieldInput";
        controller = DateFieldInputDirectiveController;
        constructor() {
            super();
            this.scope.minDate = "=";
            this.scope.maxDate = "=";
        }
    }

    export class DateFieldInputDirectiveController {
        public static $inject = [
            "$scope"
        ];

        constructor(
            private $scope: IDateFieldInputScope) {
            var unsubscribe = this.$scope.$watch("model", (newVal, oldVal) => {
                if (newVal) {
                    this.initInputModel();
                    unsubscribe();
                }
            });
            this.$scope.$watch("inputModel", (newVal, oldval) => {
                if (newVal) {
                    var date = new Date(this.$scope.inputModel.toUTCString());
                    date.setMinutes(-date.getTimezoneOffset());
                    this.$scope.model = date;
                } else {
                    this.$scope.model = null;
                }
            });
            this.$scope.$watch("minDate", (newVal, oldVal) => {
                if (newVal) {
                    if (this.$scope.inputModel < newVal) {
                        this.$scope.inputModel = null;
                    }
                }
            });
            this.$scope.$watch("maxDate",(newVal, oldVal) => {
                if (newVal) {
                    if (this.$scope.inputModel > newVal) {
                        this.$scope.inputModel = null;
                    }
                }
            });
        }

        private initInputModel() {
            this.$scope.inputModel = (this.$scope.model)
                ? (typeof (this.$scope.model) == "string" || typeof (this.$scope.model) == "number")
                    ? new Date(<string>this.$scope.model)
                    : <Date>this.$scope.model
                : null;
        }
    }
}  