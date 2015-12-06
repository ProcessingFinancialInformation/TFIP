using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class Attachment : Entity
    {
        public virtual AttachmentHeader AttachmentHeader { get; set; }
        
        public long AttachmentHeaderId { get; set; }

        public Guid UniqueFolder { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public string FileName { get; set; }
    }
}
