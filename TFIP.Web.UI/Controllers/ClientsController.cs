namespace TFIP.Web.UI.Controllers
{
    using System.Web.Mvc;

    public class ClientsController : Controller
    {

        public ActionResult ClientSelection()
        {
            return this.PartialView("ClientSelection");
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}