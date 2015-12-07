using System.ComponentModel;
using TFIP.Common.Constants;

namespace TFIP.Business.Entities
{
    public enum CreditRequestStatus
    {
        [Description(CreditRequestStatusConstants.Draft)]
        Draft = 0,

        [Description(CreditRequestStatusConstants.AwaitingSecurityValidation)]
        AwaitingSecurityValidation = 1,

        [Description(CreditRequestStatusConstants.AwaitingCreditCommissionValidation)]
        AwaitingCreditCommissionValidation = 2,

        [Description(CreditRequestStatusConstants.Denied)]
        Denied = 31,

        [Description(CreditRequestStatusConstants.InProgress)]
        InProgress = 50,

        [Description(CreditRequestStatusConstants.Extinguished)]
        Extinguished = 100
    }
}
