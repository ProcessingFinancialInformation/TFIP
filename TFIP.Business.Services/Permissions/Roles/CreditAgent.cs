using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class CreditAgent : BaseRole
    {
        public CreditAgent() : base(ConfigurationHelper.GetCreditAgentGroup())
        {
        }

        public override bool CanCreateCreditRequest()
        {
            return true;
        }

        public override bool CanCreateJuridicalClient()
        {
            return true;
        }

        public override bool CanSeeClientInformation()
        {
            return true;
        }
    }
}
