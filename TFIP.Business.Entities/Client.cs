using System.Collections.Generic;

namespace TFIP.Business.Entities
{
    public class Client : Entity, IEntityWithAttachments
    {
        public virtual ClientType ClientType { get; set; }

        public string IdentificationNo { get; set; }

        public virtual AttachmentHeader AttachmentHeader { get; set; }

        public virtual long? AttachmentHeaderId { get; set; }

        public virtual ICollection<CreditRequest> CreditRequests { get; set; }
    }
}
