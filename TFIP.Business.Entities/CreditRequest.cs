using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        public long CreditTypeId { get; set; }

        // public virtual ICollection<IndividualClient> Guarantors { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime ApprovalDate { get; set; }

        public virtual CreditRequestStatus CreditRequestStatus { get; set; }
        
        public virtual ICollection<Guarantor> Guarantors { get; set; }

    }
}
