module TFIP.Web.UI.Credit {

    export interface ICreditTypeService {
        getCreditTypes(isActive?: boolean): ng.IPromise<CreditTypeModel[]>;
        getCreditType(id: number): ng.IPromise<CreditTypeModel>;
        getPage(): ng.IPromise<CreditTypePageModel>;
        showCreateCreditType(): ng.IPromise<any>;
        saveCreditType(model: CreditTypeModel): ng.IPromise<Shared.AjaxViewModel<CreditTypeModel>>;
        changeActivity(id: number, active: boolean): ng.IPromise<any>;
        getCreditTypePage(): ng.IPromise<CreditTypePageModel>;
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

        public saveCreditType(model: CreditTypeModel): ng.IPromise<Shared.AjaxViewModel<CreditTypeModel>> {
            var deferred = this.$q.defer();

            var promise = this.httpWrapper.post<CreditTypeModel, ng.IPromise<Shared.AjaxViewModel<CreditTypeModel>>>(this.apiUrlService.creditTypeApi.saveCreditType, model);

            promise.then((data: ng.IPromise<Shared.AjaxViewModel<CreditTypeModel>>) => {
                deferred.resolve(data);
            }, (reason: Core.IRejectionReason) => {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        public showCreateCreditType(creditTypeId?: number): ng.IPromise<any> {
            var deferred = this.$q.defer();
            var p1;
            if (creditTypeId) {
                p1 = this.getCreditType(creditTypeId);
                p1.then((model: CreditTypeModel) => {
                    this.httpWrapper.get<CreditTypePageModel>(this.apiUrlService.creditTypeApi.getPage).then((data: CreditTypePageModel) => {
                        this.openModal(data, model).then((modalData: any) => {
                            deferred.resolve(modalData);
                        }, () => {
                            deferred.reject();
                        });
                    }, (reason) => {
                        this.messageBox.showError(Const.Messages.creditCreation, reason.message);
                        deferred.reject(reason);
                    });
                }, (reason) => {
                    this.messageBox.showError(Const.Messages.creditCreation, reason.message);
                    deferred.reject(reason);
                });
            } else {
                this.httpWrapper.get<CreditTypePageModel>(this.apiUrlService.creditTypeApi.getPage).then((data: CreditTypePageModel) => {
                    this.openModal(data).then((modalData: any) => {
                        deferred.resolve(modalData);
                    }, () => {
                        deferred.reject();
                    });
                }, (reason) => {
                    this.messageBox.showError(Const.Messages.creditCreation, reason.message);
                    deferred.reject(reason);
                });
            }

            return deferred.promise;
        }

        private openModal(creditTypePage: any, creditTypeModel?: any) {
            var deferred = this.$q.defer();
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: "/Credit/CreateCreditType",
                controller: CreateCreditTypeController,
                resolve: {
                    creditTypePage: () => creditTypePage,
                    creditTypeModel: () => creditTypeModel
                }
            });

            modalInstance.result.then((modalData: any) => {
                deferred.resolve(modalData);
            },(reason) => {
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

        public getCreditTypePage(): ng.IPromise<CreditTypePageModel> {
            var deferred = this.$q.defer();
            var url = this.apiUrlService.creditTypeApi.getPage;
            this.httpWrapper.get(url).then((data: CreditTypePageModel) => {
                deferred.resolve(data);
            },(reason) => {
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

        public changeActivity(id: number, active: boolean): ng.IPromise<any> {
            var deferred = this.$q.defer();
            var url = this.urlBuilderService.buildQuery(this.apiUrlService.creditTypeApi.changeActivity, { creditTypeId: id, active: active });
            this.httpWrapper.get(url).then((data: CreditTypePageModel) => {
                deferred.resolve(data);
            },(reason) => {
                    deferred.reject(reason);
                });

            return deferred.promise;
        }
    }
}   