using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class Payment : Entity
    {
        public decimal Amount { get; set; }

        public decimal MainDeptAmount { get; set; }

        public string ProcessedBy { get; set; }

        public DateTime ProcessedAt { get; set; }

        public MoneyType MoneyType { get; set; }

        public virtual CreditRequest CreditRequest { get; set; }

        public long CreditRequestId { get; set; }
    }
}
