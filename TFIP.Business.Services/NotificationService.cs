using System;
using System.Collections.Generic;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Common.Helpers;
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

        private bool SendNotification(NotificationType notificationType, Addressee addressee)
        {
            var success = true;
            foreach (var recipient in addressee.Recipients)
            {
                success &= true; // TODO: add send logic
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
