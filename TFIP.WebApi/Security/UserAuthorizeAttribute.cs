using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using TFIP.Business.Contracts;
using TFIP.Business.Services.Permissions;
using TFIP.Common.Helpers;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;

namespace TFIP.Web.Api.Security
{
    public class UserAuthorizeAttribute : AuthorizeAttribute
    {
        private Capability capability;

        public UserAuthorizeAttribute(Capability capability)
        {
            this.capability = capability;
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var currentUser = DependencyResolver.Current.GetService<ICurrentUser>();
            return PermissionService.UserHasCapability(currentUser.UserAccount, capability);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
        }
    }
}