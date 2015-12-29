module TFIP.Web.UI.SecurityInfo {
    
    export interface ISecurityInfoService {
        isInMiaDb(individualNumber: string): ng.IPromise<boolean>;
        isInNbrbDb(individualNumber: string): ng.IPromise<boolean>;
    }

    export class SecurityInfoService {

        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "messageBox",
            "$q",
            "locationHelperService",
            "urlBuilderService"
        ];
        
        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.IApiUrlService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService) { }

        public isInMiaDb(individualNumber: string): ng.IPromise<boolean> {
            return this.httpWrapper.get(this.urlBuilderService.buildQuery(this.apiUrlService.securityInfoApi.isInMiaDb, { individualNumber: individualNumber }));
        }

        public isInNbrbDb(individualNumber: string): ng.IPromise<boolean> {
            return this.httpWrapper.get(this.urlBuilderService.buildQuery(this.apiUrlService.securityInfoApi.isInNbrbDb, { individualNumber: individualNumber }));
        }
    }
} 