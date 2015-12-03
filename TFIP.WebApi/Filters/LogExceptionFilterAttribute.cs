using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;
using TFIP.Common.Helpers;
using TFIP.Common.Logging;

namespace TFIP.Web.Api.Filters
{
    public class LogExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private INotificationService notificationService
        {
            get
            {
                var service = DependencyResolver.Current.GetService<INotificationService>();
                return service;
            }
        }

        public override void OnException(HttpActionExecutedContext filterContext)
        {
            var exception = filterContext.Exception;
            if (!(exception is HttpException))
            {
                CommonLogger.Error("NLogExceptionFilter", exception);
            }
            else
            {
                CommonLogger.Error("NLog HttpException", exception);
            }

            string url = string.Empty;
            string data = string.Empty;
            string userName = string.Empty;
            LogError(ref url, ref data);
            SendNotification(filterContext, url, data);
        }

        private void LogError(ref string url, ref string data)
        {
            try
            {
                url = HttpContext.Current.Request.Url.ToString();
                CommonLogger.Info("Url = '{0}'", url);
                CommonLogger.Info("HttpMethod = '{0}'", HttpContext.Current.Request.HttpMethod);

                HttpContext.Current.Request.InputStream.Position = 0;
                using (var reader = new System.IO.StreamReader(HttpContext.Current.Request.InputStream))
                {
                    data = reader.ReadToEnd();
                }
                CommonLogger.Info("Data = '{0}'", data);

                foreach (var routeData in HttpContext.Current.Request.RequestContext.RouteData.Values)
                {
                    CommonLogger.Info("Key='{1}' Value='{2}'", routeData.Key, routeData.Value);
                }
            }
            catch (Exception e)
            {
                CommonLogger.Error("Error occures during processing unhandled exception", e);
            }
        }

        private void SendNotification(HttpActionExecutedContext context, string url, string data)
        {
            try
            {
                var recipients = GetRecipients();
                if (recipients != null)
                {
                    notificationService.SendNotificationWithException(recipients, context.Exception, url, data);
                }
            }
            catch (Exception e)
            {
                CommonLogger.Error("error occurs during send notification about unhendled error", e);
            }
        }

        private IEnumerable<string> GetRecipients()
        {
            var systemAdministrators = ActiveDirectoryHelper.GetGroupUsers(ConfigurationHelper.GetAdminGroup());
            return systemAdministrators.Select(it => it.Email);
        }
    }
}