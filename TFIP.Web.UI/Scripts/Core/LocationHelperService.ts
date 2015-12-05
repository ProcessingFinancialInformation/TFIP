module TFIP.Web.UI.Core {

    export class LocationHelperService {

        public static $inject = [
            "$location",
            "$window"
        ];

        constructor(
            private $location: ng.ILocationService,
            private $window: ng.IWindowService) { }

        public check(url: string) {
            var path = this.$location.path().toLowerCase();
            var requiredUrl = url.toLowerCase();

            if (requiredUrl[0] !== '/') {
                requiredUrl = '/' + requiredUrl;
            }

            return requiredUrl == path;
        }

        public redirect(url: string) {
            this.$window.location.href = url;
        }

        public getParameterValue(parameter: string, withCase?: boolean): string {
            var url = this.$location.absUrl();
            var myArray;
            if (withCase != null && withCase == true) {
                myArray = new RegExp(parameter + "=[^&^?]*").exec(url);
            } else {
                myArray = new RegExp(parameter.toLowerCase() + "=[^&^?]*").exec(url.toLowerCase());
            }

            if (myArray && myArray.length != 0) {
                var value = myArray[0].slice(parameter.length + 1);
                return decodeURIComponent(value);
            }
            return null;
        }

        public urlContains(value: string): boolean {
            var url = this.$location.absUrl();

            return url.search(new RegExp(value)) != -1;
        }

        public getLastPath() {
            return decodeURI(this.$location.path().split('/').filter((v: string) => v != null && v.length > 0).pop());
        }

        public getLastPathAfter(value: string) {
            var result = "";
            var addNext = false;
            this.$location.path().split('/').forEach((subUrl: string) => {
                if (addNext == true) {
                    result += '/' + subUrl;
                }
                if (subUrl == value) {
                    addNext = true;
                }
            });

            return result;
        }

        public changeUrlWithoutReload(newPath: string) {
            this.$location.url(newPath).replace();
        }
    }

}