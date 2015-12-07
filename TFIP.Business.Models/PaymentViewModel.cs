using System;

namespace TFIP.Business.Models
{
    public class PaymentViewModel
    {
        public long Id { get; set; }

        public decimal Amount { get; set; }

        public string ProcessedBy { get; set; }

        public DateTime ProcessedAt { get; set; }

        public long CreditRequestId { get; set; }
    }
}
