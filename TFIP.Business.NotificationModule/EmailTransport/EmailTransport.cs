using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using TFIP.Business.NotificationModule.Contracts;
using TFIP.Common.Helpers;

namespace TFIP.Business.NotificationModule.EmailTransport
{
    public class EmailTransport : IEmailTransport
    {
        private MailMessage mailMessage;
        private readonly EmailBuilder builder;

        public EmailTransport(EmailBuilder builder)
        {
            this.builder = builder;
        }

        /// <summary>
        /// Execute sending email notification
        /// </summary>
        /// <param name="emailNotificationData">Mail template</param>
        public bool SendMail(NotificationData emailNotificationData)
        {
            var emailTemplate = builder.BuildEmail(emailNotificationData);
            bool emailSendSuccess = true;
            foreach (var recipient in emailTemplate.RecipientContacts.Where(r => r != null))
            {
                try
                {
                    SendMail(emailTemplate.Subject, emailTemplate.Message, recipient, emailTemplate.Sender, emailNotificationData.CopyTo,
                         emailNotificationData.AttachedImagePaths);
                }
                catch (SmtpFailedRecipientsException ex)
                {
                    for (int i = 0; i < ex.InnerExceptions.Length; i++)
                    {
                        SmtpStatusCode status = ex.InnerExceptions[i].StatusCode;
                        if (status == SmtpStatusCode.MailboxBusy || status == SmtpStatusCode.MailboxUnavailable)
                        {
                            //Logger.Info("Error | Delivery failed - retrying in 5 seconds.");
                        }
                        else
                        {
                            //Logger.Info("Error | Failed to deliver message to {0}", ex.InnerExceptions[i].FailedRecipient);
                        }
                    }
                    emailSendSuccess = false;
                }
                catch (Exception exception)
                {
                    //Logger.Error("Error mail service", exception);
                    emailSendSuccess = false;
                }
            }
            return emailSendSuccess;
        }

        private void SendMail(string subject, string body, string recipient, string sender, string copyTo, IEnumerable<string> attachedImages = null)
        {
            var attachedImagePaths = GetImagePaths(attachedImages);
            //http://stackoverflow.com/questions/9279013/system-net-mail-smtpexception-service-not-available-closing-transmission-chann
            var cc = GetCopyToEmails(copyTo);
            using (var client = new SmtpConfigurator())
            {
                string to = GetEmailRecepient(recipient);
                mailMessage = new MailMessage(new MailAddress(sender), new MailAddress(to))
                {
                    Subject = GetValidSubject(GetSubject(subject, recipient)),
                    Body = body,
                    IsBodyHtml = true,
                };

                foreach (var email in cc)
                {
                    mailMessage.CC.Add(GetEmailRecepient(email));
                }

                if (attachedImagePaths.Any())
                {
                    AttachImages(mailMessage, attachedImagePaths);
                }
                if (!ConfigurationHelper.GetSMTPEnableSSL())
                {
                    ServicePointManager.ServerCertificateValidationCallback = delegate (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) { return true; };
                }

                client.Send(mailMessage);
            }
        }

        private string GetEmailRecepient(string recipient)
        {
            return IsSendAllEmailsToDemoAccount() ? ConfigurationHelper.GetDemoEmail() : recipient;
        }

        private string GetSubject(string subject, string recipient)
        {
            return IsSendAllEmailsToDemoAccount() ? string.Format("Recepient: {0} Subject: {1}", recipient, subject) : subject;
        }

        private bool IsSendAllEmailsToDemoAccount()
        {
            var demoEmail = ConfigurationHelper.GetDemoEmail();
            return NotificationHelper.IsValidEmail(demoEmail);
        }

        private IEnumerable<string> GetCopyToEmails(string copyTo)
        {
            var cc = string.IsNullOrEmpty(copyTo) ? Enumerable.Empty<string>() : copyTo.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            return cc.Where(NotificationHelper.IsValidEmail).ToList();
        }

        private static string GetValidSubject(string subject)
        {
            if (string.IsNullOrEmpty(subject))
            {
                return string.Empty;
            }
            if (subject.Contains(Environment.NewLine))
            {
                // Logger.Error(string.Format("The subject = '{0}' contains the NewLine characters", subject));
                subject = subject.Replace(Environment.NewLine, string.Empty);
            }
            return subject;
        }

        private IEnumerable<string> GetImagePaths(IEnumerable<string> attachedImages)
        {
            if (attachedImages == null)
            {
                return Enumerable.Empty<string>();
            }
            var templatesDirectoryPath = GetEmailTemplatesDirectoryPath();
            var imagesPath = attachedImages.Select(i => Path.Combine(templatesDirectoryPath, "Images", i));
            return imagesPath;
        }

        private string GetEmailTemplatesDirectoryPath()
        {
            var localAssembly = typeof(EmailTransport).Assembly;
            string assemblyAbsolutePath = new Uri(localAssembly.CodeBase).LocalPath;
            string outputDirectory = Path.GetDirectoryName(assemblyAbsolutePath);
            string templateFilePath = Path.Combine(outputDirectory, "EmailTemplates"); // TODO: move to constants
            return templateFilePath;
        }

        private void AttachImages(MailMessage mailMessage, IEnumerable<string> imageFilePaths)
        {
            foreach (var imagePath in imageFilePaths)
            {
                var imageAttachment = new Attachment(imagePath);
                imageAttachment.ContentId = Path.GetFileName(imagePath);
                mailMessage.Attachments.Add(imageAttachment);
            }
        }
    }
}
