using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions
{
    public class PermissionService
    {
        private static readonly List<IRolePermissionService> roles = new List<IRolePermissionService>();

        public static bool UserHasCapability(string userName, Capability capability, object context = null)
        {
            return roles.Any(role => role.UserHasCapability(userName, capability, context));
        }

        public static void AddRole(IRolePermissionService role)
        {
            roles.Add(role);
        }

        public static void ResetRoles()
        {
            roles.Clear();
        }

    }
}
