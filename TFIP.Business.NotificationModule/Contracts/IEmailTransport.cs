using TFIP.Business.NotificationModule.EmailTransport;

namespace TFIP.Business.NotificationModule.Contracts
{
    public interface IEmailTransport
    {
        /// <summary>
        /// Sends the specified notification data via email service.
        /// </summary>
        /// <param name="emailNotificationData">The notification data.</param>
        /// <returns></returns>
        bool SendMail(NotificationData emailNotificationData);
    }
}
