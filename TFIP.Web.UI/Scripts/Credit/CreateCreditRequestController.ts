module TFIP.Web.UI.Credit {

    export interface ICreateCreditRequestScope extends ng.IScope {
        creditRequestModel: CreditRequestModel;
        addGuarantor: () => void
        creditTypes: CreditTypeModel[];
        creditTypesViewModel: Shared.ListItem[];
        guarantorRequired: () => boolean;
        documentsRequired: () => boolean;
        getMinAmount: () => number;
        getMaxAmount: () => number;
        onSaveClick: () => void;
        creditRequestForm: Core.ICustomFormController;
        regex: Const.RegularExpressions;
        editGuarantor: (index: number) => void;
        uploader: any;
        fileSelectBtn: string;
        addFile: () => void;
        removeFile: (item: any) => void;
    }

    export class CreateCreditRequestController extends Core.BaseController {

        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "messageBox",
            "clientService",
            "creditTypes",
            "clientId",
            "clientType",
            "createCreditRequestService",
            "customFileUploader",
            "apiUrlService",
            "$q"
        ];

        private attachments: Shared.ListItem[];

        constructor(
            private $scope: ICreateCreditRequestScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private messageBox: Core.IMessageBoxService,
            private clientService: Clients.IClientService,
            private creditTypes: CreditTypeModel[],
            private clientId: number,
            private clientType: string,
            private createCreditRequestService: ICreateCreditRequestService,
            private customFileUploader: FileUploadModule.IFileUploadService,
            private apiUrlService: Core.IApiUrlService,
            private $q: ng.IQService) {
            super();

            this.$scope.creditRequestModel = new CreditRequestModel();
            this.$scope.creditRequestModel.clientId = clientId;
            this.$scope.creditRequestModel.clientType = clientType;
            this.$scope.creditTypes = creditTypes;
            this.$scope.creditTypesViewModel = creditTypes.asEnumerable().select((ct: CreditTypeModel) => {
                return {
                    id: ct.id.toString(),
                    value: ct.name
                }
            }).toArray();
            this.attachments = [];
            this.initScope();
            this.initUploader();
        }

        private initScope() {
            this.$scope.addGuarantor = () => this.addGuarantor();
            this.$scope.documentsRequired = () => this.documentsRequired();
            this.$scope.guarantorRequired = () => this.guarantorRequired();
            this.$scope.getMinAmount = () => this.getMinAmount();
            this.$scope.getMaxAmount = () => this.getMaxAmount();
            this.$scope.onSaveClick = () => this.createCreditRequest();
            this.$scope.editGuarantor = (index: number) => this.editGuarantor(index);
            this.$scope.regex = new Const.RegularExpressions();
            this.$scope.addFile = () => this.addFile();
            this.$scope.removeFile = (item: any) => this.removeFile(item);
            this.$scope.$on("$destroy", () => {
                this.customFileUploader.destroyUploader();
            });
        }

        private initUploader() {
            this.customFileUploader.initUploader({
                url: this.apiUrlService.attachmentApi.uploadFile,
                onFileSuccess: (response: Shared.AjaxViewModel<Shared.ListItem>, status: number, headers: any) => this.onFileSuccess(response, status, headers),
                onFileError: (response: any, status: number, headers: any) => this.onFileError(response, status, headers),
                continueOnError: false
            });
            this.$scope.uploader = this.customFileUploader.getUploader();
            this.$scope.fileSelectBtn = "fileSelectBtn";
        }

        private addFile() {
            var fileBtn = angular.element("[nv-file-select]");
            fileBtn.click();
        }

        private removeFile(item: any) {
            this.customFileUploader.removeItemFromQueue(item);
        }

        private createCreditRequest() {
            if (!this.$scope.creditRequestForm.$valid) {
                this.makeFormDirty(this.$scope.creditRequestForm);
                this.messageBox.showError(Const.Messages.creditCreation, Const.Messages.invalidForm);
                return;
            } 
            if (this.guarantorRequired() && (!this.$scope.creditRequestModel.guarantors || this.$scope.creditRequestModel.guarantors.length == 0)) {
                this.messageBox.showError(Const.Messages.creditCreation, Const.Messages.creditRequestNoGuarantors);
                return;
            }
            if (this.documentsRequired() && !this.customFileUploader.anyFilesToUpload()) {
                this.messageBox.showError(Const.Messages.creditCreation, Const.Messages.creditRequestNoDocuments);
                return;
            }

            if (this.documentsRequired()) {
                this.customFileUploader.uploadByFile().then(() => {
                    this.$scope.creditRequestModel.attachments = this.attachments;
                    this.createCreditRequestItself();
                }, (reason: any) => {
                    this.messageBox.showError(Const.Messages.creditCreation, reason);
                });
            } else {
                this.createCreditRequestItself();
            }
        }

        private createCreditRequestItself() {
            var promise = this.createCreditRequestService.createCreditRequest(this.$scope.creditRequestModel);

            promise.then((data: Shared.AjaxViewModel<CreditRequestModel>) => {
                if (data.isValid) {
                    this.$uibModalInstance.close(data.data);
                } else {
                    this.messageBox.showErrorMulty(Const.Messages.creditCreation, data.errors);
                }
            },(reason: Core.IRejectionReason) => {
                    this.messageBox.showError(Const.Messages.creditCreation, reason.message);
                });
        }

        private onFileSuccess(response: Shared.AjaxViewModel<Shared.ListItem>, status: number, headers: any): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.attachments.push(response.data);

            deferred.resolve();

            return deferred.promise;
        }

        private onFileError(response: any, status: number, headers: any): ng.IPromise<any> {
            var deferred = this.$q.defer();
            console.log(response);
            console.log(status);
            console.log(headers);

            deferred.resolve();

            return deferred.promise;
        }

        private addGuarantor() {
            this.clientService.showFindClients().then((data: Clients.ClientViewModel) => {
                this.pushGuarantor(data);
                console.log(this.$scope.creditRequestModel);
            }, (data: string) => {
                if (data) {
                    this.clientService.showCreateClients(data).then((data: Clients.ClientViewModel) => {
                        this.pushGuarantor(data);
                    });
                }
            });
        }

        private pushGuarantor(data: Clients.ClientViewModel) {
            if (data) {
                console.log(data);
                if (!this.$scope.creditRequestModel.guarantors) {
                    this.$scope.creditRequestModel.guarantors = [];
                }
                this.$scope.creditRequestModel.guarantors.push(data);
            }
        }

        private guarantorRequired() {
            var creditType = this.getCurrentCreditType();

            if (creditType) {
                return creditType.isGuarantorRequired;
            }
        }

        private documentsRequired() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.isDocumentsRequired;
            }
        }

        private getMinAmount() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.amountFrom;
            }
        }

        private getMaxAmount() {
            var creditType: CreditTypeModel = this.getCurrentCreditType();

            if (creditType) {
                return creditType.amountTo;
            }
        }

        private getCurrentCreditType(): CreditTypeModel {
            return this.$scope.creditTypes.asEnumerable().firstOrDefault((ct: CreditTypeModel) => {
                return ct.id == this.$scope.creditRequestModel.creditTypeId;
            });
        }

        private editGuarantor(index: number) {
            var guarantor = this.$scope.creditRequestModel.guarantors[index];

            this.clientService.showCreateClients(new Clients.ClientType().individualClient, guarantor).then((data: Clients.ClientViewModel) => {
                this.$scope.creditRequestModel.guarantors[index] = data;
            });
        }
    }
} 