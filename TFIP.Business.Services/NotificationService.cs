using TFIP.Business.Contracts;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ICreditUow creditUow;

        public NotificationService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }
    }
}
