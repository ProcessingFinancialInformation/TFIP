using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class CreditComission : BaseRole
    {
        public CreditComission() : base(ConfigurationHelper.GetCreditComissionGroup())
        {
            
        }
    }
}
