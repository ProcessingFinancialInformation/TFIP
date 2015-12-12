module TFIP.Web.UI.Core {

    export interface IMessageBoxService {
        show(title: string, message: string, additionMessage?: string): ng.IPromise<any>;
        showMulty(title: string, messages: string[], additionMessage?: string): ng.IPromise<any>;
        showErrorMulty(title: string, messages: string[]): ng.IPromise<any>;
        showWarning(title: string, message: string): ng.IPromise<any>;
        showError(title: string, message: string): ng.IPromise<any>;
        confirm(title: string, message: string): ng.IPromise<any>;
        confirmWarning(title: string, message: string): ng.IPromise<any>;
        confirmWarningWithNote(title: string, message: string, additionMessage?: string): ng.IPromise<any>;
        inputMessage(title: string, message: string): ng.IPromise<any>;
    }

    export class MessageBoxService implements IMessageBoxService {

        public static $inject = ["$uibModal", "$q"];

        constructor(private $uibModal: ng.ui.bootstrap.IModalService, private $q: ng.IQService) {
        }

        public show(title: string, message: string, additionMessage?: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.showModal(title, message, "", "OK", null, additionMessage).result["finally"](() => { deferred.resolve(); });
            return deferred.promise;
        }

        public showMulty(title: string, messages: string[], additionMessage?: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.showModalMultyMessages(title, messages, "confirm", "OK", additionMessage).result["finally"](() => { deferred.resolve(); });
            return deferred.promise;
        }

        public showErrorMulty(title: string, messages: string[]): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.showModalMulty(title, messages, "error", "OK").result["finally"](() => { deferred.resolve(); });
            return deferred.promise;
        }

        public showWarning(title: string, message: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.showModal(title, message, "warning", "OK", null).result["finally"](() => { deferred.resolve(); });
            return deferred.promise;
        }

        public showError(title: string, message: string): ng.IPromise<any> {
            var deferred = this.$q.defer();
            this.showModal(title, message, "error", "OK", null).result["finally"](() => { deferred.resolve(); });
            return deferred.promise;
        }

        public confirm(title: string, message: string): ng.IPromise<any> {
            var deferred = this.$q.defer<any>();
            this.showModal(title, message, "confirm", "OK", "Отмена").result.then(() => { deferred.resolve(); }, () => { deferred.reject(); });
            return deferred.promise;
        }

        public confirmWarning(title: string, message: string): ng.IPromise<any> {
            var deferred = this.$q.defer<any>();
            this.showModal(title, message, "warning", "OK", "Отмена").result.then(() => { deferred.resolve(); }, () => { deferred.reject(); });
            return deferred.promise;
        }

        public confirmWarningWithNote(title: string, message: string, additionMessage?: string): ng.IPromise<any> {
            var deferred = this.$q.defer<any>();
            this.showModal(title, message, "warning", "OK", "Отмена", additionMessage).result.then(() => { deferred.resolve(); }, () => { deferred.reject(); });
            return deferred.promise;
        }

        public inputMessage(title: string, message: string): ng.IPromise<any> {
            var deferred = this.$q.defer<any>();
            this.showModalWithInput(title, message, "confirm", "OK", "Отмена").result
                .then((result) => { deferred.resolve(result); }, (reason) => { deferred.reject(reason); });
            return deferred.promise;
        }

        private showModalMulty(title: string, messages: string[], icon: string, button: string): ng.ui.bootstrap.IModalServiceInstance {
            return this.$uibModal.open({
                template: '<div ng-if="model.title.length>0" class="modal-header"><h4>{{model.title}}</h4></div><div class="modal-body"> <div style="float: left" class="cell"><div class="icon {{model.icon}}"></div></div><div style="display: table-row; word-wrap: break-word;max-width:418px;" ng-repeat="msg in model.messages" class="cell message">{{msg}}</div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="$close()">{{model.button}}</button></div>',
                controller: TFIP.Web.UI.Core.MessageBoxController,
                resolve: {
                    model: (): IMultyMessageBoxModel => {
                        return {
                            title: title,
                            messages: messages,
                            icon: icon,
                            button: button,
                            cancel: null
                        };
                    }
                },
                windowClass: "message-box"
            });
        }

        private showModalMultyMessages(title: string, messages: string[], icon: string, button: string, additionMessage?: string): ng.ui.bootstrap.IModalServiceInstance {
            return this.$uibModal.open({
                template: '<div ng-if="model.title.length>0" class="modal-header"><h4>{{model.title}}</h4></div><div class="modal-body"> <div style="float: left" class="cell"><div class="icon {{model.icon}}"></div></div><div style="display: table-row; word-wrap: break-word;max-width:418px;" ng-repeat="msg in model.messages" class="cell message"><div>{{msg}}</div><br></div><div ng-show="model.additionMessage"><div>{{model.additionMessage}}</div></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="$close()">{{model.button}}</button></div>',
                controller: TFIP.Web.UI.Core.MessageBoxController,
                resolve: {
                    model: (): IMultyMessageBoxModel => {
                        return {
                            title: title,
                            messages: messages,
                            icon: icon,
                            button: button,
                            cancel: null
                            // additionMessage: additionMessage
                        };
                    }
                },
                windowClass: "message-box"
            });
        }

        private showModal(title: string, message: string, icon: string, button: string, cancel: string, additionMessage?: string): ng.ui.bootstrap.IModalServiceInstance {
            return this.$uibModal.open({
                template: '<div ng-if="model.title.length>0" class="modal-header"><h4>{{model.title}}</h4></div><div class="modal-body"> <div class="cell"><div class="icon {{model.icon}}" styles="margin: 18px;"></div></div><div style="max-width:418px;" class="cell message" ng-bind-html="model.message"></div><div ng-show="model.additionMessage"><br><div>{{model.additionMessage}}</div></div></div><div class="modal-footer"><button ng-show="model.cancel" class="btn btn=default" ng-click="$dismiss()">{{model.cancel}}</button><button class="btn btn-primary" ng-click="$close()">{{model.button}}</button></div>',
                controller: TFIP.Web.UI.Core.MessageBoxController,
                resolve: {
                    model: (): IMessageBoxModel => {
                        return {
                            title: title,
                            message: message,
                            icon: icon,
                            button: button,
                            cancel: cancel,
                            additionMessage: additionMessage
                        };
                    }
                },
                windowClass: "message-box"
            });
        }

        private showModalWithInput(title: string, message: string, icon: string, button: string, cancel: string, additionMessage?: string): ng.ui.bootstrap.IModalServiceInstance {
            var template = '';
            template += '       <div ng-if="model.title.length>0" class="modal-header">	<h4>{{model.title}}</h4></div> ';
            template += '       <div class="modal-body"><div style="max-width:418px;" class="cell message" ng-bind-html="model.message"></div>';
            template += '       <div ng-show="model.additionMessage"><br><div>{{model.additionMessage}}</div></div> ';
            template += '       <br><form name="msbForm"><div class="cell">';
            template += '           <input ng-required="true" name="text" class="ng-pristine ng-valid"type="text"ng-model="model.value">';
            template += '           <span class="error" ng-show="msbForm.text.$invalid && msbForm.text.$dirty">*</span></div> </form></div>';
            template += '       <div class="modal-footer">';
            template += '           <button ng-show="model.cancel" class="btn btn-default" ng-click="$dismiss()">{{model.cancel}}</button>';
            template += '        <button class="btn btn-primary" ng-click="$close(model.value)" ng-disabled="msbForm.$invalid" >{{model.button}}</button>';
            template += '       </div> ';
            template += ' ';
           
            return this.$uibModal.open({
                template: template,
                controller: TFIP.Web.UI.Core.MessageBoxController,
                resolve: {
                    model: (): IMessageBoxModel => {
                        return {
                            title: title,
                            message: message,
                            icon: icon,
                            button: button,
                            cancel: cancel,
                            additionMessage: additionMessage,
                            value: ""
                        };
                    }
                },
                windowClass: "message-box"
            });
        }

    }

}