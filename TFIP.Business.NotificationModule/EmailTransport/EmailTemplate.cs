namespace TFIP.Business.NotificationModule.EmailTransport
{
    public class EmailTemplate
    {
        /// <summary>
        /// Gets or sets email template type
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets mail subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets mail body
        /// </summary>
        public string Body { get; set; }
    }
}
