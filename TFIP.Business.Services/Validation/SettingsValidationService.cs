namespace TFIP.Business.Services.Validation
{
    using System.Collections.Generic;
    using System.Linq;

    using TFIP.Business.Contracts;
    using TFIP.Business.Models;
    using TFIP.Common.Resources;

    public class SettingsValidationService : IValidationService<SettingsViewModel>
    {
        public IEnumerable<string> Validate(SettingsViewModel viewModel)
        {
            var errors = new List<string>();

            if (viewModel.AgeSettings.Any(setting => string.IsNullOrEmpty(setting.Value)))
            {
                errors.Add(ErrorMessages.SettingMustNotBeEmpty);
            }

            return errors;
        }
    }
}
