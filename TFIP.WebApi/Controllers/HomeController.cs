using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;

namespace TFIP.Web.Api.Controllers
{
    public class HomeController : Controller
    {
        private readonly IMiaService miaService;

        public HomeController(IMiaService miaService)
        {
            this.miaService = miaService;
        }

        public ActionResult Index()
        {
            var a = ActiveDirectoryHelper.GetActiveDirectoryUser(User.Identity.Name);

            //ViewBag.Title = a.UserAccount;
            return View();
        }
    }
}
