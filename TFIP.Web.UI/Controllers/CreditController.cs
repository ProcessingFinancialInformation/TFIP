using System.Web.Mvc;

namespace TFIP.Web.UI.Controllers
{
    public class CreditController : Controller
    {
        // GET: Credit
        public ActionResult CreateCreditRequest()
        {
            return this.PartialView();
        }

        public ActionResult CreateCreditType()
        {
            return this.PartialView();
        }

        public ActionResult CreditRequestDetails()
        {
            return this.PartialView();
        }
    }
}