using System;

using System.Web.Http;
using System.Web.Mvc;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;

namespace TFIP.Web.Api.Controllers
{
    public class ClientsController : ApiController
    {
        private readonly IIndividualClientsService individualClientsService;

        public ClientsController(IIndividualClientsService individualClientsService)
        {
            this.individualClientsService = individualClientsService;
        }

        [System.Web.Http.HttpGet]
        public bool IsClientExist(ClientType clientType, string individualNumber)
        {
            return individualClientsService.IsClientExist(individualNumber);
        }
    }
}
