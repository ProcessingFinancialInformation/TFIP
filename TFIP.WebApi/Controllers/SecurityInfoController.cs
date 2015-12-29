using System.Web.Http;

namespace TFIP.Web.Api.Controllers
{
    using System.Net;
    using System.Net.Http;

    using TFIP.Business.Contracts;

    public class SecurityInfoController : ApiController
    {
        private readonly IMiaService miaService;

        private readonly INbrbService nbrbService;

        public SecurityInfoController(IMiaService miaService, INbrbService nbrbService)
        {
            this.miaService = miaService;
            this.nbrbService = nbrbService;
        }

        [HttpGet]
        public HttpResponseMessage IsInMiaDatabse(string individualNumber)
        {
            return this.Request.CreateResponse(HttpStatusCode.OK, this.miaService.IsInMiaDb(individualNumber));
        }

        [HttpGet]
        public HttpResponseMessage IsInNbrbDatabse(string individualNumber)
        {
            return this.Request.CreateResponse(HttpStatusCode.OK, this.nbrbService.IsInNbrbDb(individualNumber));
        }
    }
}
