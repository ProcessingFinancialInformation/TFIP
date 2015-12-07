using System.ComponentModel;
using TFIP.Common.Constants;

namespace TFIP.Business.Entities
{
    public enum CalculationType
    {
        [Description(CalculationTypeConstants.Annuity)]
        Annuity = 0,

        [Description(CalculationTypeConstants.Differencial)]
        Differencial = 1
    }
}
