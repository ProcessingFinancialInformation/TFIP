/// <reference path="../_references.ts" />

declare var window: Window;

module TFIP.Web.UI.Bootstrap {
    
    $(() => {

        //if (!window.console) window.console = new Console();

        bootstrapAngularApp();

        function bootstrapAngularApp() {
            
            var modules: ModuleBootstrapper[] = [
                ModuleBootstrapper.main([])
            ];

            $.each(modules, (_, m: ModuleBootstrapper) => m.bootstrap());
        }
    });
}