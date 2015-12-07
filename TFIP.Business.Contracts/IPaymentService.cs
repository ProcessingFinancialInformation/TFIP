using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IPaymentService
    {
        decimal MakePayment(PaymentViewModel paymnet);

        BalanceInformationViewModel GetBalanceInformationViewModel(long creditRequestId);
    }
}
