using System.Web.Mvc;
using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;

namespace TFIP.Web.Api.Controllers
{
    public class HomeController : Controller
    {
        private readonly INotificationService notificationService;

        public HomeController(INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        public ActionResult Index()
        {
            ViewBag.Title = ActiveDirectoryHelper.GetActiveDirectoryUser(User.Identity.Name);
            
            return View();
        }
    }
}
