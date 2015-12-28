using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ICreditRequestService
    {
        CreditRequestViewModel GetCreditRequestInfo(long id);

        CreditRequestListItemViewModel ApproveByCreditComission(long id);

        CreditRequestListItemViewModel Deny(long id);

        CreditRequestListItemViewModel ApproveBySecurity(long id);

        CreditRequestListItemViewModel CreateCreditRequest(CreditRequestViewModel creditRequestViewModel);
    }
}
