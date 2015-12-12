module TFIP.Web.UI.Directives {

    export class NumericFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/NumericFieldInput";
        constructor() {
            super();
            this.scope.minValue = "@";
            this.scope.maxValue = "@";
        }
    }

}  