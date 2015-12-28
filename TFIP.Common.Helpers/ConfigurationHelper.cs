using System;
using System.Configuration;
using System.IO;
using TFIP.Common.Constants;

namespace TFIP.Common.Helpers
{
    public class ConfigurationHelper
    {
        public static string GetFilesStorageFolder()
        {
            return GetSettingFromConfig(ConfigurationKeys.FilesStorageFolder);
        }

        public static string GetTemporaryFilesFolder()
        {
            return GetSettingFromConfig(ConfigurationKeys.TemporaryFilesFolder);
        }

        public static string GetWebApiUrl()
        {
            return GetSettingFromConfig(ConfigurationKeys.WebApiUrl);
        }

        public static string GetSMTPUser()
        {
            return GetSettingFromConfig(ConfigurationKeys.SMTPUser);
        }

        public static string GetSMTPPassword()
        {
            return GetSettingFromConfig(ConfigurationKeys.SMTPPassword);
        }

        public static string GetSMTPHost()
        {
            return GetSettingFromConfig(ConfigurationKeys.SMTPHost);
        }

        public static bool GetSMTPEnableSSL()
        {
            return bool.Parse(GetSettingFromConfig(ConfigurationKeys.SMTPEnableSSL));
        }

        public static int GetSMTPPort()
        {
            return int.Parse(GetSettingFromConfig(ConfigurationKeys.SMTPPort));
        }

        public static string GetDemoEmail()
        {
            return GetSettingFromConfig(ConfigurationKeys.DemoEmail);
        }

        public static string GetAdminGroup()
        {
            return GetSettingFromConfig(ConfigurationKeys.AdminGroup);
        }

        public static string GetCreditComissionGroup()
        {
            return GetSettingFromConfig(ConfigurationKeys.CreditComissionGroup);
        }

        public static string GetOperatorGroup()
        {
            return GetSettingFromConfig(ConfigurationKeys.OperatorGroup);
        }

        public static string GetSecurityAgentGroup()
        {
            return GetSettingFromConfig(ConfigurationKeys.SecurityAgentGroup);
        }

        public static string GetUiUrl()
        {
            return GetSettingFromConfig(ConfigurationKeys.UiAddress);
        }

        #region Utilities
        private static string GetSettingFromConfig(string configurationKey, string defaultValue = null)
        {
            var currentConfigurationPath = AppDomain.CurrentDomain.SetupInformation.ConfigurationFile;
            return GetSettingFromCurrentConfig(configurationKey, currentConfigurationPath, defaultValue);
        }

        private static string GetSettingFromCurrentConfig(string configurationKey, string configurationFilepath, string defaultValue = null)
        {
            var configuration = LoadConfiguration(configurationFilepath);

            if (configuration != null && configuration.HasFile)
            {
                var configItem = configuration.AppSettings.Settings[configurationKey];

                if (configItem == null)
                {
                    var parentConfiguration = configuration.AppSettings.Settings[ConfigurationKeys.BaseConfig];
                    if (parentConfiguration != null && !string.IsNullOrEmpty(parentConfiguration.Value))
                    {
                        return GetSettingFromCurrentConfig(configurationKey, parentConfiguration.Value, defaultValue);
                    }

                    if (defaultValue != null)
                    {
                        return defaultValue;
                    }

                    throw new Exception(string.Format("Error occurred when reading key '{0}' from configuration file", configurationKey));
                }

                return configItem.Value;
            }

            throw new Exception(string.Format("Configuration file {0} not found", configurationFilepath));
        }

        private static Configuration LoadConfiguration(string configFilepath)
        {
            var fileMap = new ExeConfigurationFileMap();
            fileMap.ExeConfigFilename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, configFilepath);
            var baseConfiguration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
            return baseConfiguration;
        }
        #endregion
    }
}
