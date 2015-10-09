using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TFIP.Web.Infrastructure;

namespace TFIP.WebApi
{
    public class WebApiApplication : HttpApplication
    {
        protected override void Register()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected override Assembly GetWebAssembly()
        {
            return Assembly.GetExecutingAssembly();
        }

        // TODO : Application_Error logging
    }
}
