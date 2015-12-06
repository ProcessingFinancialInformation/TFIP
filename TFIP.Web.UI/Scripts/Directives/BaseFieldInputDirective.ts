module TFIP.Web.UI.Directives {
    
    export interface IFieldInputScope extends ng.IScope {
        labelText: string;
        isRequired: boolean;
        pattern: string;
        name: string;
    }

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