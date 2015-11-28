using System.Collections.Generic;

namespace TFIP.Business.NotificationModule.EmailTransport
{
    public class EmailNotificationTemplate
    {
        public IList<string> RecipientContacts { get; set; }

        public string Message { get; set; }

        public string Subject { get; set; }

        public string Sender { get; set; }
    }
}
