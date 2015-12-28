using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;
using TFIP.Business.Services.Permissions.Context;
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
                case Capability.NBRBInformation:
                    return CanSeeNbrbInformation((CreditRequestContext)context);
                case Capability.MIDInformation:
                    return CanSeeMidInformation((CreditRequestContext)context);
                case Capability.CreateCreditRequest:
                    return CanCreateCreditRequest();
                case Capability.ApproveCreditRequest:
                    return CanApproveCreditRequest((CreditRequestContext)context);
                case Capability.ClientInformation:
                    return CanSeeClientInformation();
                case Capability.AdminPermissions:
                    return HasAdminPermissions();
                case Capability.CreateIndividualClient:
                    return CanCreateIndividualClient();
                case Capability.CreateJuridicalClient:
                    return CanCreateJuridicalClient();
                case Capability.MakePayment:
                    return CanMakePayment((CreditRequestContext)context);
                default:
                    return false;
            }
        }

        public virtual bool CanCreateJuridicalClient()
        {
            return false;
        }

        public virtual bool CanCreateIndividualClient()
        {
            return false;
        }

        public virtual bool CanMakePayment(CreditRequestContext context)
        {
            return false;
        }

        public virtual bool CanSeeNbrbInformation(CreditRequestContext context)
        {
            return false;
        }

        public virtual bool CanSeeMidInformation(CreditRequestContext context)
        {
            return false;
        }

        public virtual bool CanCreateCreditRequest()
        {
            return false;
        }

        public virtual bool CanApproveCreditRequest(CreditRequestContext context)
        {
            return false;
        }

        public virtual bool CanSeeClientInformation()
        {
            return false;
        }

        public virtual bool HasAdminPermissions()
        {
            return false;
        }
    }
}
