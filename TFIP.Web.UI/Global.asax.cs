using System.Reflection;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TFIP.Web.Infrastructure;

namespace TFIP.Web.UI
{
    public class MvcApplication : HttpApplication
    {
        protected override void Register()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected override Assembly GetWebAssembly()
        {
            return Assembly.GetExecutingAssembly();
        }
    }
}
