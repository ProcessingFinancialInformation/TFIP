using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services.Permissions
{
    using TFIP.Business.Entities;
    using TFIP.Business.Models;
    using TFIP.Business.Services.Permissions.Context;

    public class PermissionService
    {
        private static readonly List<IRolePermissionService> roles = new List<IRolePermissionService>();

        public static Dictionary<Capability, bool> GetCapabilitiesForCreditRequest(string username, CreditRequestStatus status)
        {
            CreditRequestContext context = new CreditRequestContext { Status = status };
            return new Dictionary<Capability, bool>
            {
                { Capability.ApproveCreditRequest, UserHasCapability(username, Capability.ApproveCreditRequest, context) },
                { Capability.MIDInformation, UserHasCapability(username, Capability.MIDInformation, context) },
                { Capability.NBRBInformation, UserHasCapability(username, Capability.NBRBInformation, context) },
                { Capability.MakePayment, UserHasCapability(username, Capability.MakePayment, context) }
            };
        }

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
