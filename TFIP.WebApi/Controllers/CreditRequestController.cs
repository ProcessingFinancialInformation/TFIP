using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Models;

namespace TFIP.Web.Api.Controllers
{
    using TFIP.Common.Helpers;
    using TFIP.Web.Api.Security;

    public class CreditRequestController : BaseApiController
    {
        private readonly ICreditRequestService creditRequestService;
        private readonly IValidationService<CreditRequestViewModel> creditRequestValidationService;

        public CreditRequestController(
            ICreditRequestService creditRequestService,
            IValidationService<CreditRequestViewModel> creditRequestValidationService)
        {
            this.creditRequestService = creditRequestService;
            this.creditRequestValidationService = creditRequestValidationService;
        }

        public HttpResponseMessage GetCreditRequestInfo(long id)
        {
            var creditRequest = creditRequestService.GetCreditRequestInfo(id);
            return Request.CreateResponse(HttpStatusCode.OK, creditRequest);
        }

        [HttpPost]
        public HttpResponseMessage ApproveByCreditComission(ListItem data)
        {
            var updatedRequest = creditRequestService.ApproveByCreditComission(long.Parse(data.Id));
            return Request.CreateResponse(HttpStatusCode.OK, updatedRequest);
        }

        [HttpPost]
        public HttpResponseMessage Deny(ListItem data)
        {
            var updatedRequest = creditRequestService.Deny(long.Parse(data.Id));
            return Request.CreateResponse(HttpStatusCode.OK, updatedRequest);
        }

        [HttpPost]
        public HttpResponseMessage ApproveBySecurity(ListItem data)
        {
            var updatedRequest = creditRequestService.ApproveBySecurity(long.Parse(data.Id));
            return Request.CreateResponse(HttpStatusCode.OK, updatedRequest);
        }

        [UserAuthorize(Capability.CreateCreditRequest)]
        public HttpResponseMessage CreateCreditRequest(CreditRequestViewModel creditRequest)
        {
            var creditItemViewModel = ProcessViewModel<CreditRequestViewModel, CreditRequestListItemViewModel>(creditRequest, creditRequestValidationService,
                creditRequestService.CreateCreditRequest);
            return Request.CreateResponse(HttpStatusCode.OK, creditItemViewModel);
        }
    }
}