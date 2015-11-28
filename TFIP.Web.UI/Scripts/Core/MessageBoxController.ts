module TFIP.Web.UI.Core {

    export interface IMessageBoxModel {
        title: string;
        message: string;
        icon: string;
        button: string;
        cancel: string;
        additionMessage: string;
        value?: string;
    }

    export interface IMultyMessageBoxModel {
        title: string;
        messages: string[];
        icon: string;
        button: string;
        cancel: string;
    }

    export interface IMessageBoxScope extends ng.IScope {
        model: IMessageBoxModel;
    }

    export class MessageBoxController {

        public static $inject = [
            "$scope",
            "model",
            "$modalInstance"
        ];

        constructor(
            $scope: IMessageBoxScope,
            model: IMessageBoxModel,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {
            $scope.model = model;
        }

    }

}