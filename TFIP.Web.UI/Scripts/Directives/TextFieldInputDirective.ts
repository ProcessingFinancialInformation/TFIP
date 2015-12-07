module TFIP.Web.UI.Directives {

    export class TextFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/TextFieldInput";
        constructor() {
            super();
            this.scope.minValue = "=";
            this.scope.maxValue = "=";
        }
    }

}  