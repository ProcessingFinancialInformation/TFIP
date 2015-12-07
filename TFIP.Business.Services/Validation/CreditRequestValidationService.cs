
using System.Collections.Generic;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Validation
{
    public class CreditRequestValidationService: IValidationService<CreditRequestViewModel>
    {
        private readonly ICreditUow creditUow;

        public CreditRequestValidationService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public IEnumerable<string> Validate(CreditRequestViewModel creditRequestViewModel)
        {
            return null;
        }
    }
}
