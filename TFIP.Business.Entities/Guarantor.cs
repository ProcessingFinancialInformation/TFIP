using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class Guarantor : IndividualClient
    {
        [NotMapped]
        public override ClientType ClientType { get; set; }

        [NotMapped]
        public override AttachmentHeader AttachmentHeader { get; set; }

        [NotMapped]
        public override long? AttachmentHeaderId { get; set; }

        [NotMapped]
        public override ICollection<CreditRequest> CreditRequests { get; set; }
    }
}
