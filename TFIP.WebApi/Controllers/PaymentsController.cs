using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Models;

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
            return Request.CreateResponse(HttpStatusCode.OK, new BalanceInformationViewModel());
        }
    }
}