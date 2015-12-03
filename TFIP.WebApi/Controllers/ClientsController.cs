﻿using System.Net;
using System.Net.Http;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Resources;

namespace TFIP.Web.Api.Controllers
{
    public class ClientsController : BaseApiController
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
                        return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ErrorMessages.InvalidClientType);
            }
        }

        [System.Web.Http.HttpPost]
        public HttpResponseMessage CreateIndividualClient(IndividualClientModel individualClient)
        {
            var model = ProcessViewModel(individualClient, null, individualClientsService.CreateClient);
            return Request.CreateResponse(HttpStatusCode.OK,model);
        }


    }
}
