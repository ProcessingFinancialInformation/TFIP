using System;

namespace TFIP.Business.Entities
{
    public class Notification : Entity
    {
        public string Body { get; set; }

        public string Subject { get; set; }

        public string Recepient { get; set; }

        public string Sender { get; set; }

        public DateTime CreatedAt { get; set; }

        public EmailStatus EmailStatus { get; set; }

        public string LastError { get; set; }

        public string CopyTo { get; set; }
    }
}
