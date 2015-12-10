using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using TFIP.Business.Entities;
using TFIP.Common.Helpers;
using TFIP.Business.NotificationModule.EmailTransport;
using TFIP.Business.Services.ActiveDirectory;
using TFIP.Common.Resources;

namespace TFIP.Business.Services
{
    public class NotificationService : Contracts.INotificationService
    {
        private readonly NotificationModule.Contracts.INotificationService notificationService;

        public NotificationService(NotificationModule.Contracts.INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        // TODO: Save into database!

        public bool SendNewCreditRequestCreated(long requestId, string requestNumber)
        {
            dynamic data = new ExpandoObject();
            data.Subject = EmailTemplatesSubjects.NewRequestCreated;

            data.RequestNumber = requestNumber;
            data.LinkToRequest = GenerateLinkToRequest(requestId);

            var securityDeparmentEmails =
                ActiveDirectoryHelper.GetGroupEmails(ConfigurationHelper.GetSecurityAgentGroup());

            return SendNotification(NotificationType.NewCreditRequest,
                new Addressee(securityDeparmentEmails, NotificationAccountType.Email), data);
        }

        public bool SendCreditRequestIsProcessed(string clientName, string clientEmail,
            CreditRequestStatus requestStatus)
        {
            if (requestStatus != CreditRequestStatus.Denied && requestStatus != CreditRequestStatus.InProgress)
            {
                throw new Exception("Wrong method usage.");
            }

            dynamic data = new ExpandoObject();
            data.Subject = EmailTemplatesSubjects.CreditRequestIsProcessed;

            data.ClientName = clientName;
            data.RequestProcessResult = EnumHelper.GetEnumDescription(requestStatus);

            return SendNotification(NotificationType.CreditRequestIsProcessed, 
                new Addressee(clientEmail, NotificationAccountType.Email), data);
        }

        public bool SendCreditRequestIsProcessedBySecurity(long requestId, string requestNumber)
        {
            dynamic data = new ExpandoObject();
            data.Subject = EmailTemplatesSubjects.CreditRequestIsProcessedBySecurity;

            data.RequestNumber = requestNumber;
            data.LinkToRequest = GenerateLinkToRequest(requestId);

            var creditComissionEmail =
                ActiveDirectoryHelper.GetGroupEmails(ConfigurationHelper.GetCreditComissionGroup());

            return SendNotification(NotificationType.CreditRequestIsProccessedBySecurity, 
                new Addressee(creditComissionEmail, NotificationAccountType.Email), data);
        }

        public bool SendNotificationWithException(IEnumerable<string> recepients, Exception exception, string url, string data)
        {
            dynamic obj = new ExpandoObject();
            obj.Exception = exception.ToString();
            obj.Url = url;
            obj.Data = data;

            obj.Subject = EmailTemplatesSubjects.UnhandledError;

            return SendNotification(NotificationType.UnhandledError,
                new Addressee(recepients, NotificationAccountType.Email), obj);
        }

        private string GenerateLinkToRequest(long requestId)
        {
            // TODO!
            return string.Empty;
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
