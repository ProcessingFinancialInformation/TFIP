using System.Collections.Generic;

namespace TFIP.Business.Models
{
    public class IndividualClientInfoViewModel:CreateIndividualClientViewModel
    {
        public ICollection<CreditRequestListItemViewModel> Credits;
    }
}
