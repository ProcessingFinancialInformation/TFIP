using TFIP.Business.Entities;
using TFIP.Common.Helpers;

namespace TFIP.Web.UI.Controllers
{
    using System.Web.Mvc;

    public class ClientsController : Controller
    {
        public ActionResult Index(long? clientId, ClientType? clientType)
        {
            if (clientId.HasValue)
            {
                if (clientType.HasValue)
                {
                    ViewBag.Title = EnumHelper.GetEnumDescription(clientType.Value);
                }

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

        public ActionResult CreateIndividualClientForm()
        {
            return this.PartialView();
        }

        public ActionResult CreateIndividualClientModal()
        {
            return this.PartialView();
        }

        public ActionResult FindClients()
        {
            return this.PartialView();
        }

        public ActionResult FindClientsModal()
        {
            return this.PartialView();
        }
    }
}