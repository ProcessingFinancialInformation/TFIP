using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Helpers;
using TFIP.Web.Api.Helpers;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
    public class CreditTypeController : BaseApiController
    {
        private readonly ICreditTypeService creditTypeService;

        public CreditTypeController(ICreditTypeService creditTypeService)
        {
            this.creditTypeService = creditTypeService;
        }

        public HttpResponseMessage GetPage()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new CreditTypePageViewModel()
            {
                CreditKinds = ListItemHelper.GetFromEnum(typeof (CreditKind)),
                Currencies = ListItemHelper.GetFromEnum(typeof (Currency)),
                MoneyTypes = ListItemHelper.GetFromEnum(typeof (MoneyType))
            });
        }

        public HttpResponseMessage SaveCreditType(CreditTypeViewModel model)
        {
            var result = ProcessViewModel(model, null, creditTypeService.CreateOrUpdateCreditType);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}