using System;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    using System.Linq;

    public class CreditRequestService : ICreditRequestService
    {
        private readonly ICreditUow creditUow;

        private readonly INotificationService notificationService;

        private readonly IAttachmentService attachmentService;

        public CreditRequestService(
            ICreditUow creditUow, 
            INotificationService notificationService,
            IAttachmentService attachmentService)
        {
            this.creditUow = creditUow;
            this.notificationService = notificationService;
            this.attachmentService = attachmentService;
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
            this.attachmentService.SaveAttachmentHeader(creditRequestViewModel.Attachments.ToList(), creditRequest);
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();
            return AutoMapper.Mapper.
                Map<CreditRequest, CreditRequestListItemViewModel>(creditUow.CreditRequests.GetFullCreditRequest(creditRequest.Id));
        }
    }
}
