module TFIP.Web.UI.Bootstrap {

    export class ModuleBootstrapper {

        private scope: ng.IScope;

        private registered: boolean;

        constructor(
            private module: ng.IModule,
            private rootElementSelector?: string
            ) {}

        public register(updatedElements?: Element[]) {
            if (this.needsUpdate(updatedElements)) {
                if (this.registered) {
                    this.dispose();
                }

                this.bootstrap();
            }
        }

        public bootstrap() {
            var $element: JQuery = $(this.rootElementSelector);
            angular.bootstrap($element, [this.module.name]);
            this.scope = (<any>$element).scope();
            this.registered = true;
        }

        private needsUpdate(updatedElements: Element[]) {

            if (!this.rootElementSelector) {
                return false;
            }

            var element: Element = $(this.rootElementSelector).get(0);

            if (!element) {
                return false;
            }

            return updatedElements.length == 0 ||
                Enumerable.from(updatedElements).any(panel=> $.contains(panel, element));
        }

        private dispose() {
            if (this.scope) {
                this.scope.$destroy();
            }
        }

        public static main(modules: ModuleBootstrapper[]) {
            var modulesNames: string[] = modules.asEnumerable().select((m: ModuleBootstrapper, index: number) => { return m.module.name; }).toArray();
            modulesNames = modulesNames.concat([]);
            var mainModule = angular
                .module("TFIP.Web.UI", modulesNames)
                .controller("ClientsController", TFIP.Web.UI.Clients.ClientsController)
                .controller("MasterPageController", TFIP.Web.UI.MasterPage.MasterPageController)
                .controller("HomeController", TFIP.Web.UI.Home.HomeController);

            return new ModuleBootstrapper(mainModule, "body");
        }
    }
}