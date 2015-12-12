module TFIP.Web.UI.Directives {
    
    export class SimpleMetadataDirective implements ng.IDirective {
        scope = {
            fieldName: "=",
            fieldValue: "=",
            isDate: "="
        };
        templateUrl = "/Templates/SimpleMetadataTemplate";
    }
} 