using System.Net;
using System.Net.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Helpers;
using TFIP.Web.Api.Helpers;
using TFIP.Web.Api.Security;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
    using System.Web.Http;

    public class CreditTypeController : BaseApiController
    {
        private readonly ICreditTypeService creditTypeService;
        private readonly IValidationService<CreditTypeViewModel> creditTypeValidationService;


        public CreditTypeController(ICreditTypeService creditTypeService, IValidationService<CreditTypeViewModel> creditTypeValidationService)
        {
            this.creditTypeService = creditTypeService;
            this.creditTypeValidationService = creditTypeValidationService;
        }

        [UserAuthorize(Capability.AdminPermissions)]
        public HttpResponseMessage GetPage()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new CreditTypePageViewModel()
            {
                CreditKinds = ListItemHelper.GetFromEnum(typeof (CreditKind)),
                Currencies = ListItemHelper.GetFromEnum(typeof (Currency)),
                MoneyTypes = ListItemHelper.GetFromEnum(typeof (MoneyType)),
                CalculationTypes = ListItemHelper.GetFromEnum(typeof(CalculationType))
            });
        }

        public HttpResponseMessage GetCreditType(long id)
        {
            var result = creditTypeService.GetCreditType(id);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage GetCreditTypes(bool? isActive = null)
        {
            var result = creditTypeService.GetCreditTypes(isActive);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage SaveCreditType(CreditTypeViewModel model)
        {
            var result = ProcessViewModel(model, creditTypeValidationService, creditTypeService.CreateOrUpdateCreditType);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        
        [HttpGet]
        public HttpResponseMessage ChangeActivity(long creditTypeId, bool active)
        {
            creditTypeService.ChangeCreditTypeStatus(creditTypeId, active);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}