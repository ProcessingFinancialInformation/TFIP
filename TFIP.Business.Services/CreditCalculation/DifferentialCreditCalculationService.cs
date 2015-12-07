using System.Collections.Generic;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;

namespace TFIP.Business.Services.CreditCalculation
{
    public class DifferentialCreditCalculationService : BaseCreditCalculationService, IDifferentialCreditCalculationService
    {
        public decimal CalculateCurrentMonthAmount(int creditTerm, decimal creditRate, decimal totalAmount, IEnumerable<Payment> payments)
        {
            return (totalAmount/creditTerm) + (CalculateBalance(totalAmount, payments)*((creditRate/MonthsInYear)/100));
        }
    }
}
