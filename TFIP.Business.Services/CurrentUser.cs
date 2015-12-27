using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using TFIP.Business.Contracts;
using TFIP.Business.Services.ActiveDirectory;
using TFIP.Common.Helpers;

namespace TFIP.Business.Services
{
    public class CurrentUser : ICurrentUser
    {
        public string UserAccount
        {
            get
            {
                if (IdentityType == IdentityTypeEnum.Windows)
                {
                    return Identity.Name.Split('\\')[1];
                }
                throw new System.NotImplementedException();
            }
        }
        
        public ActiveDirectoryUser ActiveDirectoryUser
        {
            get { return activeDirectoryUser ?? (activeDirectoryUser = ActiveDirectoryHelper.GetActiveDirectoryUser(UserAccount)); }
        }
        
        #region Helpers

        private enum IdentityTypeEnum
        {
            Windows,
            Claims
        }

        private IdentityTypeEnum IdentityType
        {
            get
            {
                var claims = ((ClaimsIdentity)Identity).Claims;
                var nameIdentifier = claims.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier.ToString());
                long employeedId;
                if (nameIdentifier != null && long.TryParse(nameIdentifier.Value, out employeedId))
                {
                    return IdentityTypeEnum.Claims;
                }
                return IdentityTypeEnum.Windows;
            }
        }

        private IIdentity Identity
        {
            get { return Thread.CurrentPrincipal.Identity; }
        }

        private ActiveDirectoryUser activeDirectoryUser;
        #endregion
    }
}
