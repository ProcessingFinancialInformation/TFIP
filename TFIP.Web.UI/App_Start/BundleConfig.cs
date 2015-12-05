using System.Web.Optimization;

namespace TFIP.Web.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterScriptBundles(bundles);
            RegisterStyleBundles(bundles);
        }

        private static void RegisterStyleBundles(BundleCollection bundles)
        {
            bundles.Add(
                new StyleBundle("~/Content/libs").Include("~/Content/bootstrap.min.css")
                    .Include("~/Content/blockui/angular-block-ui.css"));

            bundles.Add(new LessBundle("~/Content/common").Include(
                "~/Content/app/variables.less",
                "~/Content/app/colors.less",
                "~/Content/app/common.less"));
        }

        private static void RegisterScriptBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jQuery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .IncludeDirectory("~/Scripts/Angular", "*.js")
                .IncludeDirectory("~/Scripts/angular-sanitize", "*.js")
                .IncludeDirectory("~/Scripts/angular-ui", "*.js")
                .IncludeDirectory("~/Scripts/blockui", "*.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            "~/Scripts/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").IncludeDirectory(
                      "~/Scripts/bootstrap/", "*.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/main").IncludeDirectory("~/Scripts/App/", "*.js")
                    .IncludeDirectory("~/Scripts/Directives/", "*.js")
                    .IncludeDirectory("~/Scripts/Core/", "*.js")
                    .IncludeDirectory("~/Scripts/Extensions/", "*.js")
                    .IncludeDirectory("~/Scripts/MasterPage/", "*.js")
                    .IncludeDirectory("~/Scripts/Clients/", "*.js")
                    .IncludeDirectory("~/Scripts/Home/", "*.js")
                    .IncludeDirectory("~/Scripts/linq/", "*.js"));
        }
    }
}
