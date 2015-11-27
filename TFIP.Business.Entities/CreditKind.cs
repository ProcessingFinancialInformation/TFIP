using System.ComponentModel;
using TFIP.Common.Constants;

namespace TFIP.Business.Entities
{
    public enum CreditKind
    {
        [Description(CreditKindsConstants.Consumer)]
        Consumer = 1, 

        [Description(CreditKindsConstants.Property)]
        Property = 2,

        [Description(CreditKindsConstants.Car)]
        Car = 3,

        [Description(CreditKindsConstants.Business)]
        Business = 4,

        [Description(CreditKindsConstants.Education)]
        Education = 5,

        [Description(CreditKindsConstants.Other)]
        Other = 255
    }
}
