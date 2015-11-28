using TFIP.Business.NotificationModule.Contracts;
using TFIP.Business.NotificationModule.EmailTransport;

namespace TFIP.Business.NotificationModule
{
    public class NotificationService : INotificationService
    {
        private readonly IEmailTransport _emailTransport;

        public NotificationService(IEmailTransport emailTransport)
        {
            _emailTransport = emailTransport;
        }

        public bool SendMail(NotificationData emailNotificationData)
        {
            return _emailTransport.SendMail(emailNotificationData);
        }
    }
}
