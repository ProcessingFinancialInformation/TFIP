using System;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class CreditRequestService : ICreditRequestService
    {
        private readonly ICreditUow creditUow;
        private readonly INotificationService notificationService;

        public CreditRequestService(
            ICreditUow creditUow, 
            INotificationService notificationService
            )
        {
            this.creditUow = creditUow;
            this.notificationService = notificationService;
        }

        public CreditRequestViewModel GetCreditRequestInfo(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            return AutoMapper.Mapper.Map<CreditRequest, CreditRequestViewModel>(creditRequest);
        }

        public void ApproveByCreditComission(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            if (creditRequest.Status != CreditRequestStatus.AwaitingCreditCommissionValidation)
            {
                return;
            }

            creditRequest.Status = CreditRequestStatus.InProgress;
            creditRequest.ApprovalDate = DateTime.Now;
            creditRequest.NextPaymentDate = DateTime.Today;
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();

            if (creditRequest.IndividualClientId.HasValue)
            {
                notificationService.SendCreditRequestIsProcessed(creditRequest.IndividualClient.FirstName,
                    creditRequest.IndividualClient.ContactEmail, CreditRequestStatus.InProgress);
            }
        }

        public CreditRequestListItemViewModel CreateCreditRequest(CreditRequestViewModel creditRequestViewModel)
        {
            var creditRequest = AutoMapper.Mapper.Map<CreditRequestViewModel, CreditRequest>(creditRequestViewModel);
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();
            return AutoMapper.Mapper.
                Map<CreditRequest, CreditRequestListItemViewModel>(creditUow.CreditRequests.GetFullCreditRequest(creditRequest.Id));
        }
    }
}
