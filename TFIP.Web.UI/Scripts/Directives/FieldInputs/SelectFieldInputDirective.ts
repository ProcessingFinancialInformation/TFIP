module TFIP.Web.UI.Directives {

    export class SelectFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/SelectFieldInput"

        constructor() {
            super();
            this.scope.modelValues = "=";
        }

        link = (scope?: IFieldInputScope, $element?: ng.IAugmentedJQuery, attrs?: any) => {
            scope.$watch("model", (newVal, oldVal) => {
                if (newVal) {
                    if (typeof (newVal) != "string") {
                        scope.model = newVal.toString();
                        console.log(scope.model);
                    }
                }
            });
        };
    }

}  