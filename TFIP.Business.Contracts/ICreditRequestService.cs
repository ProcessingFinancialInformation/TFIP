using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ICreditRequestService
    {
        CreditRequestViewModel GetCreditRequestInfo(long id);
    }
}
