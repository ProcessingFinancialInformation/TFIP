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
                { Capability.CreateCreditRequest, CheckPermission(Capability.CreateCreditRequest, username) },
                { Capability.CreateIndividualClient, CheckPermission(Capability.CreateIndividualClient, username) },
                { Capability.CreateJuridicalClient, CheckPermission(Capability.CreateJuridicalClient, username) },
                { Capability.AdminPermissions, this.CheckPermission(Capability.AdminPermissions, username) },
                { Capability.EditClientInfo, this.CheckPermission(Capability.EditClientInfo, username) },
                { Capability.ClientInformation, this.CheckPermission(Capability.ClientInformation, username) },
                { Capability.MIDInformation, this.CheckPermission(Capability.MIDInformation, username) },
                { Capability.NBRBInformation, this.CheckPermission(Capability.NBRBInformation, username) }
            };
        }

        private bool CheckPermission(Capability capability, string username)
        {
            return PermissionService.UserHasCapability(username, capability);
        }
    }
}
