using System.Net;
using System.Net.Http;
using TFIP.Business.Contracts;

namespace TFIP.Web.Api.Controllers
{
    public class CreditRequestController : BaseApiController
    {
        private readonly ICreditRequestService creditRequestService;

        public CreditRequestController(
            ICreditRequestService creditRequestService)
        {
            this.creditRequestService = creditRequestService;
        }

        public HttpResponseMessage GetCreditRequestInfo(long id)
        {
            var creditRequest = creditRequestService.GetCreditRequestInfo(id);
            return Request.CreateResponse(HttpStatusCode.OK, creditRequest);
        }

        public HttpResponseMessage ApproveByCreditComission(long id)
        {
            creditRequestService.ApproveByCreditComission(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}