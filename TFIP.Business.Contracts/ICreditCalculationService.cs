using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Contracts
{
    public interface ICreditCalculationService
    {
        decimal CalculateCurrentMonthAmount(int creditTerm, decimal creditRate, decimal totalAmount, IEnumerable<Payment> payments);

        decimal CalculateBalance(decimal totalAmount, IEnumerable<Payment> payments);
    }
}
