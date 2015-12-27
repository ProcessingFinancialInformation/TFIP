using System.Collections.Generic;
using TFIP.Business.Services.Permissions;
using TFIP.Common.Helpers;

namespace TFIP.Web.ViewModels
{
    public class CapabilitiesViewModel
    {
        public Dictionary<Capability, bool> Capabilities { get; set; }

        public CapabilitiesViewModel(string username)
        {
            Capabilities = new Dictionary<Capability, bool>
            {
                {Capability.ApproveCreditRequest, CheckPermission(Capability.ApproveCreditRequest, username)},
                {Capability.CreateCreditRequest, CheckPermission(Capability.CreateCreditRequest, username)},
                {Capability.MIDInformation, CheckPermission(Capability.MIDInformation, username)},
                {Capability.NBRBInformation, CheckPermission(Capability.NBRBInformation, username)},
                {Capability.MakePayment, CheckPermission(Capability.MakePayment, username)}
            };
        }

        private bool CheckPermission(Capability capability, string username)
        {
            return PermissionService.UserHasCapability(username, capability);
        }
    }
}
