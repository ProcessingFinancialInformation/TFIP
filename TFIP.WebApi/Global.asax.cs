using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TFIP.Business.Services.Permissions;
using TFIP.Business.Services.Permissions.Roles;
using TFIP.Web.Infrastructure;

namespace TFIP.Web.Api
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
            RegisterRoles();
        }

        protected override Assembly GetWebAssembly()
        {
            return Assembly.GetExecutingAssembly();
        }

        // TODO : Application_Error logging

        private void RegisterRoles()
        {
            PermissionService.AddRole(new Admin());
            PermissionService.AddRole(new Operator());
            PermissionService.AddRole(new SecurityAgent());
            PermissionService.AddRole(new CreditComission());
        }
    }
}
