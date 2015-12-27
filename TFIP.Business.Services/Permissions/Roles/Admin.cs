using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class Admin : BaseRole
    {
        public Admin() : base(ConfigurationHelper.GetAdminGroup())
        {
            
        }

        public override bool HasAdminPermissions()
        {
            return true;
        }
    }
}
