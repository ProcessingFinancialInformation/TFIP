using System;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TFIP.Business.Services.Permissions;
using TFIP.Business.Services.Permissions.Roles;
using TFIP.Common.Logging;
using HttpApplication = TFIP.Web.Infrastructure.HttpApplication;

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

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            #if DEBUG
            string httpOrigin = Request.Params["HTTP_ORIGIN"];
            if (httpOrigin == null)
            {
                httpOrigin = "*";
            }
            
            if (Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", httpOrigin);
                HttpContext.Current.Response.StatusCode = 200;
                var httpApplication = sender as HttpApplication;
                httpApplication.CompleteRequest();
            }
            #endif
        }


        protected void Application_Error(object sender, EventArgs e)
        {
            HttpContext context = HttpContext.Current;
            try
            {
                LogError(context);
            }
            catch (Exception exception)
            {
                CommonLogger.Error("error when log eeror", exception);
            };
            Exception ex = context.Server.GetLastError();
            CommonLogger.Error("Application_Error", ex);
        }

        private void LogError(HttpContext context)
        {
            try
            {
                string userName, url, data;
                userName = context.User.Identity.Name;
                CommonLogger.Info("NLog HttpException Use Name = '{0}'", userName);
                url = context.Request.Url.ToString();
                CommonLogger.Info("Url = '{0}'", url);

                HttpContext.Current.Request.InputStream.Position = 0;
                using (var reader = new System.IO.StreamReader(context.Request.InputStream))
                {
                    data = reader.ReadToEnd();
                }
                CommonLogger.Info("Data = '{0}'", data);

                foreach (var routeData in HttpContext.Current.Request.RequestContext.RouteData.Values)
                {
                    CommonLogger.Info("userName = '{0}' Key='{1}' Value='{2}'", userName, routeData.Key, routeData.Value);
                }
            }
            catch (Exception e)
            {
                CommonLogger.Error("An error occurs during processing unhandled exception", e);
            }
        }


        protected override Assembly GetWebAssembly()
        {
            return Assembly.GetExecutingAssembly();
        }

        private void RegisterRoles()
        {
            PermissionService.AddRole(new Admin());
            PermissionService.AddRole(new Operator());
            PermissionService.AddRole(new SecurityAgent());
            PermissionService.AddRole(new CreditComission());
            PermissionService.AddRole(new CreditAgent());
        }
    }
}
