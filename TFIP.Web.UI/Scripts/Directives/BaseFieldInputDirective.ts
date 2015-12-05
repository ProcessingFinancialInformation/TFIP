module TFIP.Web.UI.Directives {
    
    export class FieldInputDirective implements ng.IDirective {
        public scope: any;
        constructor() {
            this.scope = {
                name: "=",
                labelText: "=",
                model: "=",
                isRequired: "=",
                pattern: "="
            }
        }
    }

} 