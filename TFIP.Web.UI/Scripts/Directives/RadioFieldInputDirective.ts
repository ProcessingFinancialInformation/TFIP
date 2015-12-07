module TFIP.Web.UI.Directives {

    export class RadioFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/RadioFieldInput";

        constructor() {
            super();
            this.scope.modelValues = "=";
        }
    }

}  