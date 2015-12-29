module TFIP.Web.UI.Capability {

    export interface ICapabilityService {
        capabilityModel: CapabilityModel
        initCapabilities(): ng.IPromise<any>;
        checkCapability(name: string): ng.IPromise<any>;
    }

    export class CapabilityService {
        public static $inject = [
            "httpWrapper",
            "apiUrlService",
            "messageBox",
            "$q",
            "locationHelperService"
        ];

        private initPromise: ng.IPromise<any>;

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private apiUrlService: Core.IApiUrlService,
            private messageBox: Core.IMessageBoxService,
            private $q: ng.IQService,
            private locationHelperService: Core.LocationHelperService) { }

        public capabilityModel = new CapabilityModel();

        public initCapabilities(): ng.IPromise<any> {
            this.initPromise = this.httpWrapper.get(this.apiUrlService.capabilityApi.getCapabilities).then((data: CapabilityModel) => {
                this.capabilityModel = data;
            }, (reason: Core.IRejectionReason) => {
                this.messageBox.showError(Const.Messages.capability, Const.Messages.cannotGetCapabilities)["finally"](() => {
                    window.location.reload();
                });
            });

            return this.initPromise;
        }

        public checkCapability(name: string): ng.IPromise<any> {
            var deferred = this.$q.defer();

            this.initPromise.then(() => {
                if (!this.capabilityModel.capabilities[name]) {
                    deferred.reject();
                    this.messageBox.showError(Const.Messages.capability, Const.Messages.noCapabilities)["finally"](() => {
                        this.locationHelperService.redirect("/");
                    });
                } else {
                    deferred.resolve();
                }
            }, () => {
                deferred.reject();
            });

            return deferred.promise;
        }
    }
} 