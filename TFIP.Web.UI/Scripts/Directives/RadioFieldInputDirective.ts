module TFIP.Web.UI.Directives {

    export class RadioFieldInputDirective extends FieldInputDirective {
        templateUrl = "/Templates/RadioFieldInput";

        constructor() {
            super();
            this.scope.modelValues = "=";
        }

        public link(scope?: any, $elment?: ng.IAugmentedJQuery, attrs?: any) {
            scope.radioUpdate = function(id) {
                scope.model = id;
            }
        }
    }

}  