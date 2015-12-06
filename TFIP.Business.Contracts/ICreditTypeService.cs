using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ICreditTypeService
    {
        void CreateOrUpdateCreditType(CreditTypeViewModel creditTypeViewModel);
    }
}
