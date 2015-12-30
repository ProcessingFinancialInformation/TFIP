module TFIP.Web.UI.Admin {
    export interface IAdminSettingsScope extends IAdminScope {
        settingsModel: Settings.SettingsViewModel;
        editSettings: () => void;
        settingsForm: Core.ICustomFormController;
    }

    export class AdminSettingsController extends Core.BaseController {
        public static $inject = [
            "$scope",
            "settingsService",
            "messageBox"
        ]

        constructor(
            private $scope: IAdminSettingsScope,
            private settingsService: Settings.ISettingsService,
            private messageBox: Core.IMessageBoxService) {
            super();
            this.init();
            this.$scope.editSettings = () => this.editSettings();
        }

        private init() {
            this.settingsService.getSettings().then((data: Settings.SettingsViewModel) => {
                this.$scope.settingsModel = data;
                console.log(this.$scope.settingsModel);
            }, (reason: Core.IRejectionReason) => {
                this.messageBox.showError(Const.Messages.admin, reason.message);
            });
        }

        private editSettings() {
            if (this.$scope.settingsForm.$valid) {
                this.settingsService.saveSettings(this.$scope.settingsModel).then(() => {
                    this.messageBox.show(Const.Messages.admin, "Настройки изменены");
                }, (reason: Core.IRejectionReason) => {
                    this.messageBox.showError(Const.Messages.admin, reason.message);
                });
            } else {
                this.makeFormDirty(this.$scope.settingsForm);
                this.messageBox.showError(Const.Messages.admin, Const.Messages.invalidForm);
            }
        }
    }
} 