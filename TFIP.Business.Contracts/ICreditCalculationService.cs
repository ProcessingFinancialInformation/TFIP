using System;
using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Contracts
{
    public interface ICreditCalculationService
    {
        decimal CalculateCurrentMonthAmmount(int creditTerm, decimal creditRate, decimal totalAmount, IEnumerable<Payment> payments);

        decimal CalculateBalance(decimal totalAmount, IEnumerable<Payment> payments);

        decimal CalculateFine(IEnumerable<Payment> payments, DateTime creditRequestDate, decimal creditRate,
            decimal totalAmount, int creditTerm);
    }
}
