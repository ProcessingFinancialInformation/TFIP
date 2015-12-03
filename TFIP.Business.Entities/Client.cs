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

        public int CoutryId { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string RegistrationStreet { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string ContactEmail { get; set; }

        public virtual Country Country { get; set; }

        public string ContactPhone { get; set; }
    }
}
