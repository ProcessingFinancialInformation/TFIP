module TFIP.Web.UI.MasterPage {

    export interface IMasterPageScope extends ng.IScope {
        regex: Const.RegularExpressions;
        capabilityModel: Capability.CapabilityModel;
        allExceptAdmin: () => boolean;
    }

    export class MasterPageController {
        public static $inject = [
            "$scope",
            "capabilityService",
            "locationHelperService"
        ];

        constructor(
            private $scope: IMasterPageScope,
            private capabilityService: Capability.ICapabilityService,
            private locationHelperService: Core.LocationHelperService) {

            this.$scope.regex = new Const.RegularExpressions();
            this.$scope.allExceptAdmin = () => this.allExceptAdmin();
            this.capabilityService.initCapabilities().then(() => {
                this.$scope.capabilityModel = this.capabilityService.capabilityModel;
            });
            this.$scope.$watch("capabilityModel",(newVal, oldVal) => {
                if (newVal && (this.locationHelperService.check('/') || this.locationHelperService.check('/home') || this.locationHelperService.check('/home/index'))) {
                    if (this.$scope.capabilityModel.capabilities.adminPermissions) {
                        if (!this.locationHelperService.check('admin')) {
                            this.locationHelperService.redirect('/admin');
                        }
                    }
                    if (this.$scope.capabilityModel.capabilities.clientInformation) {
                        if (!this.locationHelperService.check('/clients')) {
                            this.locationHelperService.redirect('/clients');
                        }
                    }
                }
            });
        }

        private allExceptAdmin(): boolean {
            if (this.$scope.capabilityModel) {
                var c = this.$scope.capabilityModel.capabilities;
                return c.clientInformation
            }

            return false;
        }
    }
}  