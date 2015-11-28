using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.CSharp.RuntimeBinder;
using RazorEngine;
using TFIP.Business.Entities;
using TFIP.Common.Helpers;

namespace TFIP.Business.NotificationModule.EmailTransport
{
    public class EmailBuilder
    {
        public EmailNotificationTemplate BuildEmail(NotificationData emailNotificationData)
        {
            string message = string.Empty;

            var template = GetEmailTemplateByType(emailNotificationData.Type);
            message += Razor.Parse(template.Body, emailNotificationData.Placeholders);
            message = PreMailer.Net.PreMailer.MoveCssInline(message, removeStyleElements: true).Html;
            template.Subject = emailNotificationData.Placeholders.Subject;
            string filledSubject = template.Subject;

            return new EmailNotificationTemplate
            {
                Sender = ConfigurationHelper.GetSMTPUser(),
                Message = message,
                Subject = filledSubject,
                RecipientContacts = emailNotificationData.Recipients.ToList()
            };
        }

        private EmailTemplate GetEmailTemplateByType(NotificationType templateType)
        {
            string templateContent = GetTemplateContent("Templates", templateType.ToString());

            return new EmailTemplate
            {
                Body = templateContent,
                Type = templateType.ToString()
            };
        }

        private string GetTemplateContent(string templateFolder, string templateType)
        {
            var localAssembly = typeof(EmailBuilder).Assembly;
            string assemblyAbsolutePath = new Uri(localAssembly.CodeBase).LocalPath;
            string outputDirectory = Path.GetDirectoryName(assemblyAbsolutePath);
            string templateFilePath = Path.Combine(outputDirectory, templateFolder, string.Format("{0}.html", templateType));
            return File.ReadAllText(templateFilePath);
        }
    }
}
