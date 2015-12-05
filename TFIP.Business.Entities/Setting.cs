using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Entities
{
    public class Setting: Entity
    {
        public SettingsNames SettingName { get; set; }

        public string SettingValue { get; set; }
    }
}
