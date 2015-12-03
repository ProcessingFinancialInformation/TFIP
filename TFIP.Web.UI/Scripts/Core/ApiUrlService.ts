﻿module TFIP.Web.UI.Core {

    export interface IApiUrlService {
        clientApi: ClientApi;
    }

    export class ApiUrlService {
        public static $inject = [
            "$window"
        ];

        public clientApi: ClientApi;

        constructor(private $window: ng.IWindowService) {
            var baseUrl = this.$window["consts"].webApiRoot;

            this.clientApi = new ClientApi(baseUrl);
        }
    }

    export class UrlHelperBase {

        basePath: string;

        constructor(basePath: string) {
            this.basePath = basePath;
        }

        public getBasePath(): string {
            return this.basePath;
        }
    }

    export class ClientApi extends UrlHelperBase {

        public exist: string;
        public createClient: string;
        public getIndividualClientFormInfo: string;

        constructor(basePath: string) {
            super(basePath);

            this.exist = this.getBasePath() + "api/clients/isclientExist";
            this.createClient = this.getBasePath() + "api/clients/createIndividualClient";
            this.getIndividualClientFormInfo = this.getBasePath() + "api/clients/getIndividualClientFormInfo";
        }
    }

} 