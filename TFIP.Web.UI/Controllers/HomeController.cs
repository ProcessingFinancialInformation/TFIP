using System.Web.Mvc;
using TFIP.Business.Contracts;

namespace TFIP.Web.UI.Controllers
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
            return View();
        }

        //public ActionResult PostTestNotification()
        //{
        //    notificationService.SendNewCreditRequestCreated(1, "1234");
        //    return View("Index");
        //}
    }
}