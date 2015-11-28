using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class SecurityAgent : BaseRole
    {
        public SecurityAgent() : base(ConfigurationHelper.GetSecurityAgentGroup())
        {
            
        }
    }
}
