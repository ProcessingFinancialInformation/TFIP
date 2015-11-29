using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class Client : Entity, IEntityWithAttachments
    {
        [Key]
        public string IdentificationNo { get; set; }

        public virtual AttachmentHeader AttachmentHeader { get; set; }

        public virtual long? AttachmentHeaderId { get; set; }

        public virtual ICollection<CreditRequest> CreditRequests { get; set; }
    }
}
