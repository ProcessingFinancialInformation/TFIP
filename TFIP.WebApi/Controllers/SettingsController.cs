namespace TFIP.Web.Api.Controllers
{
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using TFIP.Business.Contracts;
    using TFIP.Business.Models;
    using TFIP.Common.Helpers;
    using TFIP.Web.Api.Security;

    public class SettingsController : BaseApiController
    {
        private readonly ISettingsService settingsService;

        private readonly IValidationService<SettingsViewModel> settingValidationService;

        public SettingsController(ISettingsService settingsService, IValidationService<SettingsViewModel> settingValidationService)
        {
            this.settingsService = settingsService;
            this.settingValidationService = settingValidationService;
        }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            SettingsViewModel model = new SettingsViewModel { AgeSettings = this.settingsService.GetAgeSettings().ToList() };

            return this.Request.CreateResponse(HttpStatusCode.OK, model);
        }

        [HttpPost]
        [UserAuthorize(Capability.AdminPermissions)]
        public HttpResponseMessage Post(SettingsViewModel settings)
        {
            var model = ProcessViewModel(settings, settingValidationService, settingsService.SetAgeSettings);

            return this.Request.CreateResponse(HttpStatusCode.OK, model);
        }
    }
}
