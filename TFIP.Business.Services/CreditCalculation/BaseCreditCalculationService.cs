using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Entities;

namespace TFIP.Business.Services.CreditCalculation
{
    public abstract class BaseCreditCalculationService
    {
        protected const int MonthsInYear = 12;

        public decimal CalculateBalance(decimal totalAmount, IEnumerable<Payment> payments)
        {
            if (payments.Any())
            {
                return totalAmount - payments.Sum(it => it.MainDeptAmount);
            }

            return totalAmount;
        }
    }
}
