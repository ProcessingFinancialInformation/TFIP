using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Models
{
    public class CreditRequestListItemViewModel
    {
        public long Id { get; set; }

        public string CreditTypeName { get; set; }

        public string CreditKind { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public string Status { get; set; }

        public int StatusId { get; set; }

        public DateTime? LastPaymentDate { get; set; }
    }
}
