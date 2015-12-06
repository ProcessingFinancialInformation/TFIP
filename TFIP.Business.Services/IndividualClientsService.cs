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

        long IIndividualClientsService.IsClientExist(string identificationNo)
        {
            var client = creditUow.IndividualClients.Get(c => c.IdentificationNo.Equals(identificationNo))
                .FirstOrDefault();
            return client != null ? client.Id : 0;
        }

        public void CreateClient(CreateIndividualClientViewModel client)
        {
            var individualClient = AutoMapper.Mapper.Map<CreateIndividualClientViewModel,IndividualClient>(client);
            creditUow.IndividualClients.InsertOrUpdate(individualClient);
            creditUow.Commit();
            client.Id = individualClient.Id;
        }

        public IndividualClientInfoViewModel GetIndividualClient(long id)
        {
            var client = creditUow.IndividualClients.GetById(id);
            return AutoMapper.Mapper.Map<IndividualClient, IndividualClientInfoViewModel>(client);
        }
    }
}
