using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TFIP.Business.Entities;

namespace TFIP.Business.Models
{
    using TFIP.Common.Helpers;

    public class CreditRequestViewModel
    {
        public Dictionary<Capability, bool> Capabilities { get; set; } 

        public long Id { get; set; }

        public IEnumerable<ListItem> Attachments { get; set; }
        
        public IEnumerable<PaymentViewModel> Payments { get; set; } 

        public IEnumerable<CreateIndividualClientViewModel> Guarantors { get; set; }

        public CreditTypeViewModel CreditType { get; set; }

        public long CreditTypeId { get; set; }

        public long? ClientId { get; set; }

        public ClientType ClientType { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public decimal CurrentBalance { get; set; }

        public CreditRequestStatus Status { get; set; }

        public string DisplayStatus { get; set; }

        [Range(0, int.MaxValue)]
        public decimal TotalAmount { get; set; }
    }
}
