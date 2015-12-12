module TFIP.Web.UI.Credit {
    export interface ICreateCreditTypeScope extends ng.IScope {
        creditTypePage: CreditTypePageModel;
        creditTypeModel: CreditTypeModel;
        isIndividualValues: Shared.ListItem[];
        onSaveClick: () => void;

        regex: Const.RegularExpressions;

        min: string;

        createCreditTypeForm: Core.ICustomFormController
    }

    export class CreateCreditTypeController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "creditTypePage",
            "creditTypeModel",
            "creditTypeService",
            "messageBox"
        ];

        constructor(
            private $scope: ICreateCreditTypeScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private creditTypePage: CreditTypePageModel,
            private creditTypeModel: CreditTypeModel,
            private creditTypeService: ICreditTypeService,
            private messageBox: Core.IMessageBoxService) {

            if (this.creditTypeModel) {
                this.$scope.creditTypeModel = this.creditTypeModel;
            } else {
                this.$scope.creditTypeModel = new CreditTypeModel();
            }

            this.$scope.isIndividualValues = [{ id: 'true', value: "Для физицеских лиц" }, { id: 'false', value: "Для юридических лиц" }];
            this.$scope.creditTypePage = creditTypePage;
            this.$scope.$watch("creditTypeModel", (newVal, oldVal) => {
                console.log(this.$scope.creditTypeModel);
            }, true);

            this.$scope.onSaveClick = () => this.onSaveClick();
            this.$scope.regex = new Const.RegularExpressions();
            this.$scope.min = "0";
        }

        private onSaveClick() {
            if (this.$scope.createCreditTypeForm.$valid) {
                var promise = this.creditTypeService.saveCreditType(this.$scope.creditTypeModel);

                promise.then((data: Shared.AjaxViewModel<CreditTypeModel>) => {
                    if (data.isValid) {
                        this.$uibModalInstance.close(data.data);
                    } else {
                        this.messageBox.showErrorMulty(Const.Messages.creditTypeCreation, data.errors);
                    }
                }, (reason: Core.IRejectionReason) => {
                    if (!reason.aborted) {
                        this.messageBox.showError(Const.Messages.creditTypeCreation, reason.message);
                    }
                });
            } else {
                if (this.$scope.createCreditTypeForm.$error.required) {
                    for (var i = 0; i < this.$scope.createCreditTypeForm.$error.required.length; i++) {
                        if (this.$scope.createCreditTypeForm.$error.required[i].fieldInput) {
                            this.$scope.createCreditTypeForm.$error.required[i].fieldInput.$dirty = true;
                        }
                    }
                }
                if (this.$scope.createCreditTypeForm.$error.pattern) {
                    for (var i = 0; i < this.$scope.createCreditTypeForm.$error.pattern.length; i++) {
                        if (this.$scope.createCreditTypeForm.$error.pattern[i].fieldInput) {
                            this.$scope.createCreditTypeForm.$error.pattern[i].fieldInput.$dirty = true;
                        }
                    }
                }

                this.messageBox.showError(Const.Messages.creditTypeCreation, Const.Messages.invalidForm);
            }
        }
    }
} 