using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class IndividualClientsService: IIndividualClientsService
    {
        private readonly ICreditUow creditUow;

        private readonly IBaseRepository<Client> clientsRepository;

        public IndividualClientsService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        bool IIndividualClientsService.IsClientExist(string individualNumber)
        {
            return
                creditUow.IndividualClients.Get(client => client.IdentificationNo.Equals(individualNumber))
                    .FirstOrDefault() != null;
        }
    }
}
