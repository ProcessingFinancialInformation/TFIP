using System.Collections.Generic;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class SettingsService: ISettingsService
    {
        private readonly ICreditUow creditUow;

        public SettingsService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public IEnumerable<ListItem> GetAgeSettings()
        {
            return AutoMapper.Mapper.Map<IEnumerable<Setting>, IEnumerable<ListItem>>(creditUow.Settings
                .Get(s => s.SettingName == SettingsNames.Adulthood || s.SettingName == SettingsNames.MaxAge));
        }

        public void SetAgeSettings(SettingsViewModel ageSetting)
        {
            IEnumerable<Setting> settings = AutoMapper.Mapper.Map<IEnumerable<ListItem>, IEnumerable<Setting>>(ageSetting.AgeSettings);

            foreach (Setting setting in settings)
            {
                this.creditUow.Settings.InsertOrUpdate(setting);
            }

            this.creditUow.Commit();
        }
    }
}
