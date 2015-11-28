using System.Collections.Generic;
using System.Dynamic;
using TFIP.Business.Entities;
using TFIP.Common.Helpers;
using TFIP.Data.Contracts;
using TFIP.Business.NotificationModule.EmailTransport;
using TFIP.Common.Resources;

namespace TFIP.Business.Services
{
    public class NotificationService : Contracts.INotificationService
    {
        private readonly ICreditUow creditUow;
        private readonly NotificationModule.Contracts.INotificationService notificationService;

        public NotificationService(ICreditUow creditUow, NotificationModule.Contracts.INotificationService notificationService)
        {
            this.creditUow = creditUow;
            this.notificationService = notificationService;
        }

        public bool SendNewCreditRequestCreated(long requestId, string requestNumber)
        {
            dynamic data = new ExpandoObject();
            data.Subject = EmailTemplatesSubjects.NewRequestCreated;

            data.RequestNumber = requestNumber;
            data.LinkToRequest = "http://google.com/";

            return SendNotification(NotificationType.NewCreditRequest,
                new Addressee("gromilich@gmail.com", NotificationAccountType.Email), data);
        }

        private bool SendNotification(NotificationType notificationType, Addressee addressee, dynamic data)
        {
            var success = true;
            foreach (var recipient in addressee.Recipients)
            {
                success &= notificationService.SendMail(new NotificationData()
                {
                    CopyTo = addressee.CopyToEmail,
                    Recipients = List.Of(recipient),
                    Type = notificationType,
                    Placeholders = data
                });
            }

            return success;
        }

        private class Addressee
        {
            public Addressee(IEnumerable<string> recipients, NotificationAccountType recipientAccountType,
                string copyToEmai)
                : this(recipients, recipientAccountType)
            {
                CopyToEmail = copyToEmai;
            }

            public Addressee(IEnumerable<string> recipients, NotificationAccountType recipientAccountType)
            {
                Recipients = recipients;
                RecipientAccountType = recipientAccountType;
            }

            public Addressee(string recipient, NotificationAccountType recipientAccountType,
                string copyToEmail)
                : this(recipient, recipientAccountType)
            {
                CopyToEmail = copyToEmail;
            }
            public Addressee(string recipient, NotificationAccountType recipientAccountType)
            {
                Recipients = List.Of(recipient);
                RecipientAccountType = recipientAccountType;
            }

            public IEnumerable<string> Recipients { get; set; }

            public NotificationAccountType RecipientAccountType { get; set; }

            public string CopyToEmail { get; set; }
        }
    }
}
