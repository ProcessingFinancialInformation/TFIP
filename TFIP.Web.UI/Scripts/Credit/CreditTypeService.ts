module TFIP.Web.UI.Credit {

    export interface ICreditTypeService {
        getCreditTypes(isActive?: boolean): ng.IPromise<CreditTypeModel[]>;
        getCreditType(id: number): ng.IPromise<CreditTypeModel>;
        getPage(): ng.IPromise<CreditTypePageModel>;
        showCreateCreditType(): ng.IPromise<any>;
    }

    export class CreditTypeService implements ICreditTypeService {

        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "urlBuilderService",
            "$q",
            "$uibModal",
            "messageBox"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.ApiUrlService,
            private urlBuilderService: Core.IUrlBuilderService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private messageBox: Core.IMessageBoxService) {

        }

        public showCreateCreditType(creditTypeId?: number): ng.IPromise<any> {
            var deferred = this.$q.defer();

            this.httpWrapper.get<CreditTypePageModel>(this.apiUrlService.creditTypeApi.getPage).then((data: CreditTypePageModel) => {
                var modalInstance = this.$uibModal.open({
                    templateUrl: "/Credit/CreateCreditType",
                    controller: CreateCreditTypeController,
                    resolve : {
                        creditTypePage: () => data,
                        creditTypeId: () => creditTypeId
                    }
                });

                modalInstance.result.then(() => {
                    deferred.resolve();
                }, (reason) => {
                    deferred.reject(reason);
                });
            },(reason) => {
                this.messageBox.showError("Создание кредита", reason.message);
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public getCreditTypes(isActive?: boolean): ng.IPromise<CreditTypeModel[]> {
            var deferred = this.$q.defer();
            var url = this.apiUrlService.creditTypeApi.getCredtTypes;
            this.httpWrapper.get(url).then((data: CreditTypeModel[]) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public getCreditType(id: number): ng.IPromise<CreditTypeModel> {
            var deferred = this.$q.defer();
            var url = this.urlBuilderService.buildQuery(this.apiUrlService.creditTypeApi.getCredtTypes, { id: id });
            this.httpWrapper.get(url).then((data: CreditTypeModel) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public getPage(): ng.IPromise<CreditTypePageModel> {
            var deferred = this.$q.defer();
            var url = this.apiUrlService.creditTypeApi.getPage;
            this.httpWrapper.get(url).then((data: CreditTypePageModel) => {
                deferred.resolve(data);
            }, (reason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }
    }
}   