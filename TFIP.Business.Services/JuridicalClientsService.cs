using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
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

        public void CreateClient(JuridicalClientViewModel client)
        {
            var juridicalClient = AutoMapper.Mapper.Map<JuridicalClientViewModel, JuridicalClient>(client);
            creditUow.JuridicalClients.InsertOrUpdate(juridicalClient);
            creditUow.Commit();
        }
    }
}
