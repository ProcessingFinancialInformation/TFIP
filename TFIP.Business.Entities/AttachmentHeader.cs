using System.Collections.Generic;

namespace TFIP.Business.Entities
{
    public class AttachmentHeader : Entity
    {
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
