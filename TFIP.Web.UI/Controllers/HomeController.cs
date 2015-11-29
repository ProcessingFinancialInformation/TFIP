using System.Web.Mvc;

namespace TFIP.Web.UI.Controllers
{
    public class HomeController : Controller
    {

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