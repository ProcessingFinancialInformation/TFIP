using System.Web;
using System.Web.Optimization;

namespace TFIP.Web.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jQuery/jquery-{version}.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/angular")
                    .IncludeDirectory("~/Scripts/Angular", "*.js").IncludeDirectory("~/Scripts/angular-sanitize", "*.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").IncludeDirectory(
                      "~/Scripts/bootstrap/", "*.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/main").IncludeDirectory("~/Scripts/App/", "*.js")
                    .IncludeDirectory("~/Scripts/Extensions/", "*.js")
                    .IncludeDirectory("~/Scripts/Home/", "*.js")
                    .IncludeDirectory("~/Scripts/linq/", "*.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
