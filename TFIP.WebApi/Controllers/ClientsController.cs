using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;

namespace TFIP.Web.Api.Controllers
{
    public class ClientsController : ApiController
    {
        private readonly IIndividualClientsService individualClientsService;

        private readonly IJuridicalClientsService juridicalClientsService;

        public ClientsController(IIndividualClientsService individualClientsService, IJuridicalClientsService juridicalClientsService)
        {
            this.individualClientsService = individualClientsService;
            this.juridicalClientsService = juridicalClientsService;
        }

        [System.Web.Http.HttpGet]
        public HttpResponseMessage IsClientExist(ClientType clientType, string individualNumber)
        {
            switch (clientType)
            {
                    case ClientType.Individual:
                        return this.Request.CreateResponse(HttpStatusCode.OK,individualClientsService.IsClientExist(individualNumber));

                    case ClientType.JuridicalPerson:
                        return this.Request.CreateResponse(HttpStatusCode.OK, juridicalClientsService.IsClientExist(individualNumber));
                default:
                    return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Неверный тип клиента");
            }
        }
    }
}
