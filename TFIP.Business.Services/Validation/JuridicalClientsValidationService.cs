using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Resources;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Validation
{
    public class JuridicalClientsValidationService
    {
        private readonly ICreditUow creditUow;

        public JuridicalClientsValidationService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public IEnumerable<string> Validate(JuridicalClientViewModel viewModel)
        {
            var errors = new List<string>();
            if (creditUow.JuridicalClients.Get(c => c.IdentificationNo == viewModel.IdentificationNo)
                .FirstOrDefault() != null)
            {
                errors.Add(String.Format(ErrorMessages.UniqueJuridicalClientIdentificationNumber, viewModel.IdentificationNo));
            }
            if (creditUow.JuridicalClients.Get(c => c.PAN == viewModel.PAN)
                .FirstOrDefault() != null)
            {
                errors.Add(String.Format(ErrorMessages.UniquePan, viewModel.PAN));
            }
            if (creditUow.JuridicalClients.Get(c => c.RegistrationNumber == viewModel.RegistrationNumber)
                .FirstOrDefault() != null)
            {
                errors.Add(String.Format(ErrorMessages.UniqueRegistrationNumber, viewModel.RegistrationNumber));
            }
            return errors;
        }
    }
}
