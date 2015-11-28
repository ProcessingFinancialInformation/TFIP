using TFIP.Common.Helpers;

namespace TFIP.Business.Contracts
{
    public interface IRolePermissionService
    {
        bool UserHasCapability(string userName, Capability capability, object context);
    }
}
