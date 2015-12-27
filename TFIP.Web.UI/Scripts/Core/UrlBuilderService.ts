module TFIP.Web.UI.Core {
    
    export interface IUrlBuilderService {
        buildQuery(template: string, params: any): string;
    }

    export class UrlBuilderService implements IUrlBuilderService {

        public static $inject = [
            "$location"
        ];

        constructor(private $location: ng.ILocationService) {
        }

        public buildQuery(template: string, params: any): string {
            var queryString = "?";

            queryString = queryString.concat($.param(params, false));

            return template.concat(queryString);
        }
    }
}  