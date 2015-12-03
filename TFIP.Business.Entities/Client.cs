using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class Client : Entity, IEntityWithAttachments
    {
        [MaxLength(14)]
        public string IdentificationNo { get; set; }

        public virtual AttachmentHeader AttachmentHeader { get; set; }

        public virtual long? AttachmentHeaderId { get; set; }

        public virtual ICollection<CreditRequest> CreditRequests { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string Street { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string Email { get; set; }
    }
}
