using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class Operator : BaseRole
    {
        public Operator() : base(ConfigurationHelper.GetOperatorGroup())
        {
            
        }
    }
}
