using System;

namespace TFIP.Business.Entities
{
    public class Payment : Entity
    {
        public decimal Amount { get; set; }

        public string ProcessedBy { get; set; }

        public DateTime ProcessedAt { get; set; }

        public MoneyType MoneyType { get; set; }
    }
}
