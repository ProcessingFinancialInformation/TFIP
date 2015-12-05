namespace TFIP.Web.UI.Controllers
{
    using System.Web.Mvc;

    public class ClientsController : Controller
    {
        public ActionResult Index(long? clientId)
        {
            if (clientId.HasValue)
            {
                return this.View("Client");
            }

            return View();
        }

        public ActionResult CreateIndividualClient()
        {
            return View();
        }

        public ActionResult CreateJuridicalPersonClient()
        {
            return this.View();
        }
    }
}