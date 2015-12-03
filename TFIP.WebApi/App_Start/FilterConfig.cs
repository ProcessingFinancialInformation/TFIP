using System.Web.Mvc;
using TFIP.Web.Api.Filters;

namespace TFIP.Web.Api
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
