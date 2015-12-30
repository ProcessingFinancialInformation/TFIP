module TFIP.Web.UI.Settings {

    export class SettingsViewModel {
        ageSettings: Shared.ListItem[];
    }

    export interface ISettingsService {
        getSettings(): ng.IPromise<SettingsViewModel>;
        saveSettings(model: SettingsViewModel): ng.IPromise<Shared.AjaxViewModel<SettingsViewModel>>;
    }

    export class SettingsService {

        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "messageBox",
            "$q",
            "locationHelperService",
            "urlBuilderService"
        ];

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.IApiUrlService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private locationHelperService: Core.LocationHelperService,
            private urlBuilderService: Core.IUrlBuilderService) { }

        public getSettings(): ng.IPromise<SettingsViewModel> {
            return this.httpWrapper.get(this.apiUrlService.settingsApi.getSettings);
        }

        public saveSettings(model: SettingsViewModel): ng.IPromise<Shared.AjaxViewModel<SettingsViewModel>> {
            return this.httpWrapper.post(this.apiUrlService.settingsApi.postSettings, model);
        }
    }
} 