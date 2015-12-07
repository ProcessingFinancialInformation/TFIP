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
    public class CreditTypeValidationService: IValidationService<CreditTypeViewModel>
    {
         private readonly ICreditUow creditUow;

         public CreditTypeValidationService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

         public IEnumerable<string> Validate(CreditTypeViewModel viewModel)
        {
            var errors = new List<string>();
            if (viewModel.IsDocumentsRequired && String.IsNullOrEmpty(viewModel.RequiredDocuments))
            {
                errors.Add(ErrorMessages.DocumentsRequired);
            }
            return errors;
        }
    }
}
