using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Entities
{
    public enum SettingsNames
    {
        [Description("Возраст совершеннолетия")]
        Adulthood = 0,
        [Description("Максимально допустимый возраст")]
        MaxAge = 1
    }
}
