using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions.Roles
{
    public class BaseRole : IRolePermissionService
    {
        private readonly string roleName;

        public BaseRole(string roleName)
        {
            this.roleName = roleName;
        }

        public virtual bool UserHasCapability(string userAccount, Capability capability, object context = null)
        {
            if (!ActiveDirectoryHelper.IsUserInRole(userAccount, roleName))
            {
                return false;
            }

            switch (capability)
            {
                case Capability.TestCapability:
                    return CanTest();

                default:
                    return false;
            }
        }

        public virtual bool CanTest()
        {
            return false;
        }
    }
}
