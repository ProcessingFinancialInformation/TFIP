using TFIP.Business.Entities;
using TFIP.Business.Services.Permissions.Context;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class CreditComission : BaseRole
    {
        public CreditComission() : base(ConfigurationHelper.GetCreditComissionGroup())
        {
        }

        public override bool CanApproveCreditRequest(CreditRequestContext context)
        {
            return context.Status == CreditRequestStatus.AwaitingCreditCommissionValidation;
        }

        //public override bool CanSeeNbrbInformation(CreditRequestContext context)
        //{
        //    return context.Status == CreditRequestStatus.AwaitingCreditCommissionValidation;
        //}

        public override bool CanSeeClientInformation()
        {
            return true;
        }
    }
}
