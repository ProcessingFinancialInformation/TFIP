using System.ComponentModel;

namespace TFIP.Business.Entities
{
    public enum MoneyType
    {
        [Description("Наличный расчёт")]
        Cash = 1,
        [Description("Безналичный расчёт")]
        Cashless = 2
    }
}
