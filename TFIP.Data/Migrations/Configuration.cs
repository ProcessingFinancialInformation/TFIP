using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using TFIP.Business.Entities;

namespace TFIP.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<CreditDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(CreditDbContext context)
        {
            AddDefaultSetting(context, SettingsNames.Adulthood, "18");
            AddDefaultSetting(context, SettingsNames.MaxAge, "100");
        }

        private void AddDefaultSetting(CreditDbContext context, SettingsNames settingName, string defaultValue)
        {
            var setting = context.Settings
                .AsNoTracking()
                .SingleOrDefault(x => x.SettingName == settingName);

            if (setting == null)
                context.Settings.Add(new Setting
                {
                    SettingName = settingName,
                    SettingValue = defaultValue
                });
        }
    }
}
