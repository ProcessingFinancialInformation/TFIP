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
        private readonly IValidationService<IndividualClientViewModel> individualClientValidationService;
        private readonly IValidationService<JuridicalClientViewModel> juridicalClientValidationService;
        private readonly ICountryService countryService;
        private readonly ISettingsService settingsService;

        public ClientsController(
            IIndividualClientsService individualClientsService, 
            IJuridicalClientsService juridicalClientsService,
            ICountryService countryService,
            ISettingsService settingsService,
            IValidationService<IndividualClientViewModel> individualClientValidationService,
            IValidationService<JuridicalClientViewModel> juridicalClientValidationService)
        {
            this.individualClientsService = individualClientsService;
            this.juridicalClientsService = juridicalClientsService;
            this.countryService = countryService;
            this.settingsService = settingsService;
            this.individualClientValidationService = individualClientValidationService;
            this.juridicalClientValidationService = juridicalClientValidationService;
        }

        [HttpGet]
        public HttpResponseMessage GetIndividualClientFormInfo()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new IndividualClientFormViewModel()
            {
                Countries = countryService.GetCountries(),
                AgeSettings = settingsService.GetAgeSettings()
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
        public HttpResponseMessage CreateOrUpdateIndividualClient(IndividualClientViewModel individualClient)
        {
            var model = ProcessViewModel(individualClient, individualClientValidationService, individualClientsService.CreateClient);
            return Request.CreateResponse(HttpStatusCode.OK, model);
        }

        [HttpPost]
        public HttpResponseMessage CreateOrUpdateJuridicalClient(JuridicalClientViewModel juridicalClient)
        {
            var model = ProcessViewModel(juridicalClient, juridicalClientValidationService, juridicalClientsService.CreateClient);
            return Request.CreateResponse(HttpStatusCode.OK, model);
        }

        [HttpGet]
        public HttpResponseMessage Get(long clientId, ClientType clientType)
        {
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                new { FirstName = "Полигаф", Patronymic = "Полиграфович", IdentificationNo = "123123" });
        }
    }
}
