using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class IndividualClientsService: IIndividualClientsService
    {
        private readonly ICreditUow creditUow;

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

        public void CreateClient(IndividualClientViewModel client)
        {
            var individualClient = AutoMapper.Mapper.Map<IndividualClientViewModel,IndividualClient>(client);
            creditUow.IndividualClients.InsertOrUpdate(individualClient);
            creditUow.Commit();
            client.Id = individualClient.Id;
        }
    }
}
