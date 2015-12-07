using System;
using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Models
{
    public class CreditRequestViewModel
    {
        public long Id { get; set; }

        public IEnumerable<ListItem> Attachments { get; set; }
        
        public IEnumerable<PaymentViewModel> Payments { get; set; } 

        public IEnumerable<CreateIndividualClientViewModel> Guarantors { get; set; }

        public CreditTypeViewModel CreditType { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public decimal CurrentBalance { get; set; }

        public CreditRequestStatus Status { get; set; }

        public string DisplayStatus { get; set; }

        public decimal TotalAmount { get; set; }
    }
}
