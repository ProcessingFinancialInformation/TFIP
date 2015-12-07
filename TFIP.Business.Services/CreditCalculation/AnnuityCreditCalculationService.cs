using System;
using System.Collections.Generic;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;

namespace TFIP.Business.Services.CreditCalculation
{
    public class AnnuityCreditCalculationService : BaseCreditCalculationService, IAnnuityCreditCalculationService
    {
        public decimal CalculateCurrentMonthAmount(int creditTerm, decimal creditRate, decimal totalAmount,
            IEnumerable<Payment> payments)
        {
            var monthRate = (creditRate/MonthsInYear)/100;
            var koefficient = monthRate*(decimal) Math.Pow((double) (1 + monthRate), creditTerm)/
                              (decimal)((Math.Pow((double) (1 + monthRate), creditTerm) - 1));

            return koefficient * totalAmount;
        }

    }
}
