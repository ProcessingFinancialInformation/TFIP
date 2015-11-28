using System.Net;
using System.Net.Mail;
using TFIP.Common.Helpers;

namespace TFIP.Business.NotificationModule.EmailTransport
{
    public class SmtpConfigurator : SmtpClient
    {
        public SmtpConfigurator()
        {
            this.Credentials = new NetworkCredential(ConfigurationHelper.GetSMTPUser(), ConfigurationHelper.GetSMTPPassword());
            this.Host = ConfigurationHelper.GetSMTPHost();
            this.Port = ConfigurationHelper.GetSMTPPort();
            this.EnableSsl = ConfigurationHelper.GetSMTPEnableSSL();
        }
    }
}
