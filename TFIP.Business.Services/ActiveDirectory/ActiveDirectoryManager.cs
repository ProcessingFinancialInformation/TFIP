using System.DirectoryServices.AccountManagement;

namespace TFIP.Business.Services.ActiveDirectory
{
    public static class ActiveDirectoryManager
    {
        public static bool IsUserInGroup(string userAccount, string groupName)
        {
            PrincipalContext principalContext = new PrincipalContext(ContextType.Domain);
            UserPrincipal userPrincipal = UserPrincipal.FindByIdentity(principalContext, userAccount);

            if (userPrincipal != null)
            {
                foreach (var group in userPrincipal.GetAuthorizationGroups())
                {
                    if (group.Name == groupName)
                        return true;
                }
            }
            return false;
        }
    }
}
