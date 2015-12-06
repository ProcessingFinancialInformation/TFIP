using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Models
{
    public class PaymentViewModel
    {
        public decimal Amount { get; set; }

        public long CreditRequestId { get; set; }
    }
}
