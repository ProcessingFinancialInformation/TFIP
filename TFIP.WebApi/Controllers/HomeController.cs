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
            var a = ActiveDirectoryHelper.GetActiveDirectoryUser(User.Identity.Name);

            ViewBag.Title = a.UserAccount;
            return View();
        }
    }
}
