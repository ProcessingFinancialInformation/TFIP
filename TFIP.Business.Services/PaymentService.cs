using System;
using System.Linq;
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

        public PaymentService(ICreditUow creditUow, IAnnuityCreditCalculationService annuityCreditCalculationService)
        {
            this.creditUow = creditUow;
            this.annuityCreditCalculationService = annuityCreditCalculationService;
        }

        public decimal MakePayment(PaymentViewModel paymentViewModel)
        {
            var payment = AutoMapper.Mapper.Map<PaymentViewModel, Payment>(paymentViewModel);
            payment.ProcessedAt = DateTime.Now;
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(payment.CreditRequestId);
            ProcessPayment(creditRequest, payment);
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();
            return annuityCreditCalculationService.CalculateBalance(creditRequest.TotalAmount, creditRequest.Payments);
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

        private void ProcessPayment(CreditRequest creditRequest, Payment payment)
        {
            payment.MainDeptAmount = payment.Amount - creditRequest.CurrentBalanceOnPercents;
            creditRequest.CurrentBalanceOnPercents = 0;
            creditRequest.CurrentBalance = 0;
            creditRequest.Payments.Add(payment);

            var totalMainDeptPayments = creditRequest.Payments.Sum(it => it.MainDeptAmount);
            if (creditRequest.TotalAmount - totalMainDeptPayments <= 0)
            {
                creditRequest.Status = CreditRequestStatus.Extinguished;
            }
        }
    }
}
