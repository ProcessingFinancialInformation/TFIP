using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Models;
using TFIP.Common.Resources;

namespace TFIP.Web.Api.Controllers
{
    public class PaymentsController: BaseApiController
    {
        private readonly IPaymentService paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            this.paymentService = paymentService;
        }

        [HttpPost]
        public HttpResponseMessage MakePayment(PaymentViewModel payment)
        {
            var balance = ProcessViewModel<PaymentViewModel,decimal>(payment, null, paymentService.MakePayment);
            return Request.CreateResponse(HttpStatusCode.OK, balance);
        }

        [HttpGet]
        public HttpResponseMessage GetBalanceInformation(long creditRequestId)
        {
            var balanceInfo = paymentService.GetBalanceInformationViewModel(creditRequestId);
            return balanceInfo != null ? 
                Request.CreateResponse(HttpStatusCode.OK, balanceInfo) : 
                Request.CreateResponse(HttpStatusCode.BadRequest, String.Format(ErrorMessages.InvalidCreditRequestId,creditRequestId));
        }
    }
}