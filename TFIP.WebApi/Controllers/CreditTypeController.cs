using System;
using System.Net;
using System.Net.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Business.Services.Validation;
using TFIP.Web.Api.Helpers;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
    public class CreditTypeController : BaseApiController
    {
        private readonly ICreditTypeService creditTypeService;
        private readonly IValidationService<CreditTypeViewModel> creditTypeValidationService;


        public CreditTypeController(ICreditTypeService creditTypeService, IValidationService<CreditTypeViewModel> creditTypeValidationService)
        {
            this.creditTypeService = creditTypeService;
            this.creditTypeValidationService = creditTypeValidationService;
        }

        public HttpResponseMessage GetPage()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new CreditTypePageViewModel()
            {
                CreditKinds = ListItemHelper.GetFromEnum(typeof (CreditKind)),
                Currencies = ListItemHelper.GetFromEnum(typeof (Currency)),
                MoneyTypes = ListItemHelper.GetFromEnum(typeof (MoneyType)),
                PaymentTypes = ListItemHelper.GetFromEnum(typeof(CreditType))
            });
        }

        public HttpResponseMessage GetCreditType(long id)
        {
            var result = creditTypeService.GetCreditType(id);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage GetCreditTypes(bool? isActive)
        {
            var result = creditTypeService.GetCreditTypes(isActive);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage SaveCreditType(CreditTypeViewModel model)
        {
            var result = ProcessViewModel(model, creditTypeValidationService, creditTypeService.CreateOrUpdateCreditType);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage Deactivate(long creditTypeId)
        {
            creditTypeService.ChangeCreditTypeStatus(creditTypeId, false);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public HttpResponseMessage Activate(long creditTypeId)
        {
            creditTypeService.ChangeCreditTypeStatus(creditTypeId, true);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}