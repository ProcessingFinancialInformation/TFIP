using System.Collections.Generic;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ICreditTypeService
    {
        void CreateOrUpdateCreditType(CreditTypeViewModel creditTypeViewModel);

        void ChangeCreditTypeStatus(long id, bool isActive);

        IEnumerable<CreditTypeViewModel> GetCreditTypes(bool? isActive, bool? isIndividual);

        CreditTypeViewModel GetCreditType(long id);
    }
}
