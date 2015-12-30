using System.Web.Mvc;

namespace TFIP.Web.UI.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Error404()
        {
            ViewBag.Title = "404 - Страница не найдена";
            return View();
        }

        public ActionResult Error500()
        {
            ViewBag.Title = "Произошла серверная ошибка";
            return View();
        }

    //public ActionResult PostTestNotification()
        //{
        //    notificationService.SendNewCreditRequestCreated(1, "1234");
        //    return View("Index");
        //}
    }
}