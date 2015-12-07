module TFIP.Web.UI.Credit {
    export interface ICreateCreditTypeScope extends ng.IScope {
        creditTypePage: CreditTypePageModel;
        creditTypeModel: CreditTypeModel;
        isIndividualValues: Shared.ListItem[];
    }

    export class CreateCreditTypeController {
        public static $inject = [
            "$scope",
            "$uibModalInstance",
            "creditTypePage",
            "creditTypeId"
        ];

        constructor(
            private $scope: ICreateCreditTypeScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private creditTypePage: CreditTypePageModel,
            private creditTypeId: number) {

            if (this.creditTypeId) {

            } else {
                this.$scope.creditTypeModel = new CreditTypeModel();
            }

            this.$scope.isIndividualValues = [{ id: 'true', value: "Для физицеских лиц" }, { id: 'false', value: "Для юридических лиц" }];
            this.$scope.creditTypePage = creditTypePage;
            console.log(this.$scope.creditTypePage);
            this.$scope.$watch("creditTypeModel", (newVal, oldVal) => {
                console.log(this.$scope.creditTypeModel);
            }, true);

        }
    }
} 