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
    public class JuridicalClientsService: IJuridicalClientsService
    {
        private readonly ICreditUow creditUow;

        public JuridicalClientsService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        bool IJuridicalClientsService.IsClientExist(string individualNumber)
        {
            return
                creditUow.JuridicalClients.Get(client => client.IdentificationNo.Equals(individualNumber))
                    .FirstOrDefault() != null;
        }
    }
}
