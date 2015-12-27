using System.Security.Principal;

namespace TFIP.Common.Helpers
{
    public class ActiveDirectoryUser
    {
        public string UserAccount { get; set; }
        public string DisplayName { get; set; }
        public SecurityIdentifier Sid { get; set; }
        public string Email { get; set; }
    }
}
