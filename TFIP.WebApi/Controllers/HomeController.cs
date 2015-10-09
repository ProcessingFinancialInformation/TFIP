using System.Web.Mvc;
using TFIP.Business.Contracts;

namespace TFIP.WebApi.Controllers
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
            ViewBag.Title = "Home Page";
            
            return View();
        }
    }
}
