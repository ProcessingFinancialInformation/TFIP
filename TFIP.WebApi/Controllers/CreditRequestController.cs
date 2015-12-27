using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Models;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
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

        public HttpResponseMessage ApproveByCreditComission(long id)
        {
            creditRequestService.ApproveByCreditComission(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public HttpResponseMessage CreateCreditRequest(CreditRequestViewModel creditRequest)
        {
            var creditItemViewModel = ProcessViewModel<CreditRequestViewModel, CreditRequestListItemViewModel>(creditRequest, creditRequestValidationService,
                creditRequestService.CreateCreditRequest);
            return Request.CreateResponse(HttpStatusCode.OK, creditItemViewModel);
        }
    }
}