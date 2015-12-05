using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Resources;
using TFIP.Web.ViewModels;

namespace TFIP.Web.Api.Controllers
{
    public class ClientsController : BaseApiController
    {
        private readonly IIndividualClientsService individualClientsService;
        private readonly IJuridicalClientsService juridicalClientsService;
        private readonly ICountryService countryService;

        public ClientsController(
            IIndividualClientsService individualClientsService, 
            IJuridicalClientsService juridicalClientsService,
            ICountryService countryService)
        {
            this.individualClientsService = individualClientsService;
            this.juridicalClientsService = juridicalClientsService;
            this.countryService = countryService;
        }

        [HttpGet]
        public HttpResponseMessage GetIndividualClientFormInfo()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new IndividualClientFormViewModel()
            {
                Countries = countryService.GetCountries()
            });
        }

        [HttpGet]
        public HttpResponseMessage IsClientExist(ClientType clientType, string individualNumber)
        {
            switch (clientType)
            {
                    case ClientType.Individual:
                        return this.Request.CreateResponse(HttpStatusCode.OK,individualClientsService.IsClientExist(individualNumber));

                    case ClientType.JuridicalPerson:
                        return this.Request.CreateResponse(HttpStatusCode.OK, juridicalClientsService.IsClientExist(individualNumber));
                default:
                        return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ErrorMessages.InvalidClientType);
            }
        }

        [HttpPost]
        public HttpResponseMessage CreateIndividualClient(IndividualClientViewModel individualClient)
        {
            var model = ProcessViewModel(individualClient, null, individualClientsService.CreateClient);
            return Request.CreateResponse(HttpStatusCode.OK, model);
        }
    }
}
