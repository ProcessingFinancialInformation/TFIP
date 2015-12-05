module TFIP.Web.UI.Directives {

    export class SelectFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/SelectFieldInput"

        constructor() {
            super();
            this.scope.modelValues = "=";
        }
    }

}  