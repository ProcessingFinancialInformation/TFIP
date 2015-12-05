using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Resources;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Validation
{
    public class IndividualClientValidationService: IValidationService<IndividualClientViewModel>
    {
        private readonly ICreditUow creditUow;

        public IndividualClientValidationService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public IEnumerable<string> Validate(IndividualClientViewModel viewModel)
        {
            var errors = new List<string>();
            var adulthoodSetting =
                creditUow.Settings.Get(s => s.SettingName == SettingsNames.Adulthood).FirstOrDefault();
            if (adulthoodSetting != null)
            {
                int adulthood;
                if (int.TryParse(adulthoodSetting.SettingValue, out adulthood) &&
                    viewModel.DateOfBirth < DateTime.Today.AddYears(-adulthood))
                {
                    errors.Add(String.Format(ErrorMessages.Adulthood, adulthood));
                }
               
            }
            var maxAgeSetting = creditUow.Settings.Get(s => s.SettingName == SettingsNames.MaxAge).FirstOrDefault();
            if (maxAgeSetting != null)
            {
                int maxAge;
                if (int.TryParse(maxAgeSetting.SettingValue, out maxAge) &&
                    viewModel.DateOfBirth < DateTime.Today.AddYears(-maxAge))
                {
                    errors.Add(String.Format(ErrorMessages.MaxAge, maxAge));
                }
            }

            return errors;
        }
    }
}
