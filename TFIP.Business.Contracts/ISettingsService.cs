using System.Collections.Generic;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ISettingsService
    {
        IEnumerable<ListItem> GetAgeSettings();

        void SetAgeSettings(SettingsViewModel ageSetting);
    }
}
