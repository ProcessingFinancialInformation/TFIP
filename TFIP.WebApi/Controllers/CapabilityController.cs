using System.Net;
using System.Net.Http;
using TFIP.Business.Contracts;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
    using System.Web.Http;

    public class CapabilityController : BaseApiController
    {
        private readonly ICurrentUser currentUser;

        public CapabilityController(ICurrentUser currentUser)
        {
            this.currentUser = currentUser;
        }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new CapabilitiesViewModel(currentUser.UserAccount));
        }
    }
}