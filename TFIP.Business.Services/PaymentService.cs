using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class PaymentService: IPaymentService
    {
        private readonly ICreditUow creditUow;
        private readonly IAnnuityCreditCalculationService annuityCreditCalculationService;

        public PaymentService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public decimal MakePayment(PaymentViewModel paymnetViewModel)
        {
            var payment = AutoMapper.Mapper.Map<PaymentViewModel, Payment>(paymnetViewModel);
            payment.ProcessedAt = DateTime.Now;
            creditUow.Payments.InsertOrUpdate(payment);
            creditUow.Commit();
            return 0;
        }

        public BalanceInformationViewModel GetBalanceInformationViewModel(long creditRequestId)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(creditRequestId);
            return new BalanceInformationViewModel
            {
                CurrentMonthFee = creditRequest.CurrentBalance,
                MainDebtBalance = annuityCreditCalculationService.CalculateBalance(creditRequest.TotalAmount,creditRequest.Payments)
            };
        }
    }
}
