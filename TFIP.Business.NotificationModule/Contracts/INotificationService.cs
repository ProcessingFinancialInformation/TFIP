using TFIP.Business.NotificationModule.EmailTransport;

namespace TFIP.Business.NotificationModule.Contracts
{
    public interface INotificationService
    {
        bool SendMail(NotificationData emailNotificationData);
    }
}
