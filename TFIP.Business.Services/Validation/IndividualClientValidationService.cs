using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
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
            //if (adulthoodSetting != null)
            //{
            //    var adultHood = 
            //   if(viewModel.DateOfBirth< DateTime.Now.AddYears())
            //}
            return errors;
        }
    }
}
