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
            modulesNames = modulesNames.concat(["ui.bootstrap", "ngSanitize", 'blockUI', 'angularFileUpload']);
            var mainModule = angular
                .module("TFIP.Web.UI", modulesNames)
                .directive("textFieldInput",() => new Directives.TextFieldInputDirective)
                .directive("textAreaFieldInput",() => new Directives.TextAreaFieldInputDirective)
                .directive("dateFieldInput",() => new Directives.DateFieldInputDirective)
                .directive("selectFieldInput",() => new Directives.SelectFieldInputDirective)
                .directive("radioFieldInput",() => new Directives.RadioFieldInputDirective)
                .directive("checkBoxFieldInput",() => new Directives.CheckBoxFieldInputDirective)
                .directive("numericFieldInput",() => new Directives.NumericFieldInputDirective)
                .directive("simpleMetadata",() => new Directives.SimpleMetadataDirective)
                .service("messageBox", Core.MessageBoxService)
                .service("apiUrlService", Core.ApiUrlService)
                .service("urlBuilderService", Core.UrlBuilderService)
                .service("clientService", Clients.ClientService)
                .service("locationHelperService", Core.LocationHelperService)
                .service("httpWrapper", Core.CustomHttpService)
                .service("creditTypeService", Credit.CreditTypeService)
                .service("creditRequestService", Credit.CreditRequestService)
                .service("paymentsService", Payments.PaymentsService)
                .service("customFileUploader", FileUploadModule.FileUploadService)
                .controller("ClientController", TFIP.Web.UI.Clients.ClientController)
                .controller("ClientsSelectorController", TFIP.Web.UI.Clients.ClientsSelectorController)
                .controller("CreateClientConroller", Clients.CreateIndividualClientController)
                .controller("CreateJuridicalClientController", Clients.CreateJuridicalClientController)
                .controller("AdminController", Admin.AdminController)
                .controller("MasterPageController", TFIP.Web.UI.MasterPage.MasterPageController)
                .controller("HomeController", TFIP.Web.UI.Home.HomeController);

            return new ModuleBootstrapper(mainModule, "body");
        }
    }
}