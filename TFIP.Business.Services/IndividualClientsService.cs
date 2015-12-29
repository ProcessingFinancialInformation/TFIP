using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Constants;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    using TFIP.Business.Services.Permissions;

    public class IndividualClientsService: IIndividualClientsService
    {
        private readonly ICreditUow creditUow;

        private readonly ICurrentUser currentUser;

        public IndividualClientsService(ICreditUow creditUow, ICurrentUser currentUser)
        {
            this.creditUow = creditUow;
            this.currentUser = currentUser;
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
            IndividualClientInfoViewModel model = AutoMapper.Mapper.Map<IndividualClient, IndividualClientInfoViewModel>(client);
            model.Credits = model.Credits.Select(
                c =>
                    {
                        c.Capabilities = PermissionService.GetCapabilitiesForCreditRequest(
                            this.currentUser.UserAccount,
                            (CreditRequestStatus)c.StatusId);

                        return c;
                    }).ToList();

            return model;
        }

        public IEnumerable<ClientListItemViewModel> GetIndividualClients()
        {
            var query = creditUow.IndividualClients.All();
            return AutoMapper.Mapper.Map<List<ClientListItemViewModel>>(query.ToList());
        }
    }
}
