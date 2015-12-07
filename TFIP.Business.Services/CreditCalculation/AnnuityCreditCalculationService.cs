using System;
using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;

namespace TFIP.Business.Services.CreditCalculation
{
    public class AnnuityCreditCalculationService : IAnnuityCreditCalculationService
    {
        private const int monthsInYear = 12;

        public decimal CalculateCurrentMonthAmmount(int creditTerm, decimal creditRate, decimal totalAmount,
            IEnumerable<Payment> payments)
        {
            var monthRate = creditRate/monthsInYear;
            var koefficient = monthRate*(decimal) Math.Pow((double) (1 + monthRate), creditTerm)/
                              (decimal)((Math.Pow((double) (1 + monthRate), creditTerm) - 1));

            return koefficient * totalAmount;
        }

        public decimal CalculateBalance(decimal totalAmount, IEnumerable<Payment> payments)
        {
            if (payments.Any())
            {
                return totalAmount - payments.Sum(it => it.MainDeptAmount);
            }

            return totalAmount;
        }

        public decimal CalculateFine(IEnumerable<Payment> payments, DateTime creditRequestDate, decimal creditRate,
            decimal totalAmount, int creditTerm)
        {
            var payed = payments.Any() ? payments.Sum(it => it.MainDeptAmount) : (decimal)0.00;
            var months = (int)Math.Floor(DateTime.Now.Subtract(creditRequestDate).TotalDays / 30);

            return 0;
        }
    }
}
