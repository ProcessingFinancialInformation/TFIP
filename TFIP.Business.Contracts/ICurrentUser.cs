using TFIP.Common.Helpers;

namespace TFIP.Business.Contracts
{
    public interface ICurrentUser
    {
        string UserAccount { get; }
        
        ActiveDirectoryUser ActiveDirectoryUser { get; }
    }
}
