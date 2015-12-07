module TFIP.Web.UI.Core {

    export interface IApiUrlService {
        clientApi: ClientApi;
        creditTypeApi: CreditTypeApi;
    }

    export class ApiUrlService {
        public static $inject = [
            "$window"
        ];

        public clientApi: ClientApi;
        public creditTypeApi: CreditTypeApi;

        constructor(private $window: ng.IWindowService) {
            var baseUrl = this.$window["consts"].webApiRoot;

            this.clientApi = new ClientApi(baseUrl);
            this.creditTypeApi = new CreditTypeApi(baseUrl);
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
        public createJuridicalClient: string;
        public getIndividualClientFormInfo: string;
        public getClient: string;

        constructor(basePath: string) {
            super(basePath);

            this.exist = this.getBasePath() + "api/clients/isclientExist";
            this.createClient = this.getBasePath() + "api/clients/createOrUpdateIndividualClient";
            this.getIndividualClientFormInfo = this.getBasePath() + "api/clients/getIndividualClientFormInfo";
            this.createJuridicalClient = this.getBasePath() + "api/clients/createOrUpdateJuridicalClient";
            this.getClient = this.getBasePath() + "api/clients/get";
        }
    }

    export class CreditTypeApi extends UrlHelperBase {
        public getCredtTypes: string;
        public getCredtType: string;
        public getPage: string;
        public saveCreditType: string;

        constructor(basePath: string) {
            super(basePath);

            this.getCredtTypes = this.getBasePath() + "api/creditType/getCreditTypes";
            this.getCredtType = this.getBasePath() + "api/creditType/getCreditType";
            this.getPage = this.getBasePath() + "api/creditType/getPage";
            this.saveCreditType = this.getBasePath() + "api/creditType/saveCreditType";
        }
    }

} 