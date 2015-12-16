using System;
using System.Collections.Generic;

namespace TFIP.Business.Entities
{
    public class CreditRequest : Entity, IEntityWithAttachments 
    {
        public AttachmentHeader AttachmentHeader { get; set; }
        
        public long? AttachmentHeaderId { get; set; }
        
        public virtual JuridicalClient JuridicalClient { get; set; }

        public long? JuridicalClientId { get; set; }

        public virtual IndividualClient IndividualClient { get; set; }

        public long? IndividualClientId { get; set; }

        public virtual ICollection<Payment> Payments { get; set; }

        public virtual CreditType CreditType { get; set; }

        public decimal TotalAmount { get; set; }

        public long CreditTypeId { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public DateTime? NextPaymentDate { get; set; }

        /// <summary>
        /// Shows the amount of money to pay for current month
        /// </summary>
        public decimal CurrentBalance { get; set; }

        public decimal CurrentBalanceOnPercents { get; set; }

        public CreditRequestStatus Status { get; set; }
        
        public virtual ICollection<Guarantor> Guarantors { get; set; }
    }
}