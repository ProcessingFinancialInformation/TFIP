using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.NotificationModule.EmailTransport
{
    /// <summary>
    /// Notification data for email template
    /// </summary>
    public class NotificationData
    {
        public NotificationData()
        {
            Recipients = new List<string>();
            AttachedImagePaths = new List<string>();
        }

        /// <summary>
        /// Gets or sets the list of emails to send the notification.
        /// </summary>
        public IEnumerable<string> Recipients { get; set; }

        /// <summary>
        /// Gets or sets the placeholder values to replace in the templates.
        /// </summary>
        public dynamic Placeholders { get; set; }

        /// <summary>
        /// Gets or sets the notification template from the list.
        /// </summary>
        public NotificationType Type { get; set; }

        /// <summary>
        /// Gets or sets the email for Copy field.
        /// </summary>

        public string CopyTo { get; set; }

        /// <summary>
        /// Gets or sets the attached image paths.
        /// </summary>
        public IEnumerable<string> AttachedImagePaths { get; set; }
    }
}
