using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IPaymentService
    {
        decimal MakePayment(PaymentViewModel paymentViewModel);

        BalanceInformationViewModel GetBalanceInformationViewModel(long creditRequestId);
    }
}
