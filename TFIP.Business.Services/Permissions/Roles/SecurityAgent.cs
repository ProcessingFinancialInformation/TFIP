using TFIP.Business.Entities;
using TFIP.Business.Services.Permissions.Context;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class SecurityAgent : BaseRole
    {
        public SecurityAgent() : base(ConfigurationHelper.GetSecurityAgentGroup())
        {
            
        }

        public override bool CanApproveCreditRequest(CreditRequestContext context)
        {
            return context.Status == CreditRequestStatus.AwaitingSecurityValidation;
        }

        public override bool CanSeeMidInformation(CreditRequestContext context)
        {
            return context.Status == CreditRequestStatus.AwaitingSecurityValidation;
        }

        public override bool CanSeeClientInformation()
        {
            return true;
        }
    }
}
