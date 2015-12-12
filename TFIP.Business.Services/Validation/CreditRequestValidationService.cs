using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Resources;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Validation
{
    public class CreditRequestValidationService: IValidationService<CreditRequestViewModel>
    {
        private readonly ICreditUow creditUow;
        private readonly IValidationService<CreateIndividualClientViewModel> individualClientValidationService;

        public CreditRequestValidationService(ICreditUow creditUow, IValidationService<CreateIndividualClientViewModel> individualClientValidationService)
        {
            this.creditUow = creditUow;
            this.individualClientValidationService = individualClientValidationService;
        }

        public IEnumerable<string> Validate(CreditRequestViewModel creditRequestViewModel)
        {
            var errors = new List<string>();
            var creditType = creditUow.CreditTypes.GetById(creditRequestViewModel.CreditTypeId);
            if (creditType == null)
            {
                errors.Add(String.Format(ErrorMessages.InvalidCreditTypeId, creditRequestViewModel.CreditTypeId));
            }
            else
            {
                if (creditRequestViewModel.TotalAmount < creditType.AmountFrom ||
                    creditRequestViewModel.TotalAmount > creditType.AmountTo)
                {
                    errors.Add(String.Format(ErrorMessages.InvalidTotalAmountRange, creditType.AmountFrom, creditType.AmountTo));
                }
                if (creditType.IsGuarantorRequired)
                {
                    if (creditRequestViewModel.Guarantors == null || !creditRequestViewModel.Guarantors.Any())
                    {
                        errors.Add(String.Format(ErrorMessages.GuarantorsRequired));
                    }
                    else
                    {
                        if (creditRequestViewModel.ClientId.HasValue)
                        {
                            var individualClient =
                                creditUow.IndividualClients.GetById(creditRequestViewModel.ClientId.Value);
                            if (
                                creditRequestViewModel.Guarantors.Any(
                                    guarantor => guarantor.IdentificationNo == individualClient.IdentificationNo))
                            {
                                errors.Add(ErrorMessages.ClientAsGuarantor);
                            }
                        }
                        foreach (var guarantor in creditRequestViewModel.Guarantors)
                        {
                            errors.AddRange(ValidateGuarantor(guarantor));
                        }
                    }
                }
            }
            if (!creditRequestViewModel.ClientId.HasValue)
            {
                errors.Add(ErrorMessages.ClienttIdRequired);
            }
            else
            {
                if (!IsClientExist(creditRequestViewModel.ClientType, creditRequestViewModel.ClientId.Value))
                {
                    errors.Add(String.Format(ErrorMessages.InvalidClientId, creditRequestViewModel.ClientId.Value));
                }
            }
            return errors;
        }

        private bool IsClientExist(ClientType clientType, long clientId)
        {
            bool isExist = false;
            switch (clientType)
            {
                case ClientType.Individual:
                    isExist = creditUow.IndividualClients.GetById(clientId)!=null;
                    break;
                case ClientType.JuridicalPerson:
                    isExist = creditUow.IndividualClients.GetById(clientId) != null;
                    break;
            }
            return isExist;
        }

        private IEnumerable<string> ValidateGuarantor(CreateIndividualClientViewModel guarantor)
        {
            var errors = new List<string>();
            var adulthoodSetting =
                creditUow.Settings.Get(s => s.SettingName == SettingsNames.Adulthood).FirstOrDefault();
            if (adulthoodSetting != null)
            {
                int adulthood;
                if (int.TryParse(adulthoodSetting.SettingValue, out adulthood) &&
                    guarantor.DateOfBirth > DateTime.Today.AddYears(-adulthood))
                {
                    errors.Add(String.Format(ErrorMessages.Adulthood, adulthood));
                }

            }
            var maxAgeSetting = creditUow.Settings.Get(s => s.SettingName == SettingsNames.MaxAge).FirstOrDefault();
            if (maxAgeSetting != null)
            {
                int maxAge;
                if (int.TryParse(maxAgeSetting.SettingValue, out maxAge) &&
                    guarantor.DateOfBirth < DateTime.Today.AddYears(-maxAge))
                {
                    errors.Add(String.Format(ErrorMessages.MaxAge, maxAge));
                }
            }
            if (guarantor.DateOfIssue > guarantor.DateOfExpiry)
            {
                errors.Add(ErrorMessages.InvalidIssueAndExpiryDate);
            }
            if (creditUow.Countries.GetById(guarantor.CountryId) == null)
            {
                errors.Add(String.Format(ErrorMessages.InvalidCountryId, guarantor.CountryId));
            }
            return errors;
        }
    }
}
