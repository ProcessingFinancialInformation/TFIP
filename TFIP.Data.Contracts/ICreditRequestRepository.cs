using TFIP.Business.Entities;

namespace TFIP.Data.Contracts
{
    public interface ICreditRequestRepository : IBaseRepository<CreditRequest>
    {
        CreditRequest GetFullCreditRequest(long id);
    }
}
