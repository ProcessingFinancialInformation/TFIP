using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IIndividualClientsService
    {
        bool IsClientExist(string IndividualNumber);

        void CreateClient(IndividualClientViewModel client);
    }
}
