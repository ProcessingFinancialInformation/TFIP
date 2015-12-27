using TFIP.Business.Entities;
using TFIP.Business.Services.Permissions.Context;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class Operator : BaseRole
    {
        public Operator() : base(ConfigurationHelper.GetOperatorGroup())
        {
            
        }

        public override bool CanMakePayment(CreditRequestContext context)
        {
            return context.Status == CreditRequestStatus.InProgress;
        }

        public override bool CanCreateCreditRequest()
        {
            return true;
        }

        public override bool CanSeeClientInformation()
        {
            return true;
        }
    }
}
