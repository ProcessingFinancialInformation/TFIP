using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Helpers;
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
    }
}
