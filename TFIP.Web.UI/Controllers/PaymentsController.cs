using System.Web.Mvc;

namespace TFIP.Web.UI.Controllers
{
    public class PaymentsController : Controller
    {
        public ActionResult MakePaymentModal()
        {
            return PartialView();
        }
    }
}