using System;
using System.Collections.Generic;

namespace TFIP.Business.Models
{
    using TFIP.Common.Helpers;

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

        public Dictionary<Capability, bool> Capabilities { get; set; } 
    }
}
