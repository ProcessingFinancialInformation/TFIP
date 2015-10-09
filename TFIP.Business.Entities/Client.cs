using System.Collections.Generic;

namespace TFIP.Business.Entities
{
    public class Client : Entity, IEntityWithAttachments
    {
        public ClientType ClientType { get; set; }

        public virtual AttachmentHeader AttachmentHeader { get; set; }

        public long? AttachmentHeaderId { get; set; }

        public virtual ICollection<CreditRequest> CreditRequests { get; set; }
    }
}
