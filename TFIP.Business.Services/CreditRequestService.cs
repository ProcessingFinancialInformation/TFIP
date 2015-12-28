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

        public CreditRequestListItemViewModel ApproveByCreditComission(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            if (creditRequest.Status != CreditRequestStatus.AwaitingCreditCommissionValidation)
            {
                return null;
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

            return AutoMapper.Mapper.Map<CreditRequest, CreditRequestListItemViewModel>(creditRequest);
        }

        public CreditRequestListItemViewModel Deny(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            creditRequest.Status = CreditRequestStatus.Denied;
            creditRequest.ApprovalDate = DateTime.Now;
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();

            if (creditRequest.IndividualClientId.HasValue)
            {
                notificationService.SendCreditRequestIsProcessed(creditRequest.IndividualClient.FirstName,
                    creditRequest.IndividualClient.ContactEmail, creditRequest.Status);
            }

            return AutoMapper.Mapper.Map<CreditRequest, CreditRequestListItemViewModel>(creditRequest);
        }

        public CreditRequestListItemViewModel ApproveBySecurity(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            if (creditRequest.Status != CreditRequestStatus.AwaitingSecurityValidation)
            {
                return null;
            }

            creditRequest.Status = CreditRequestStatus.AwaitingCreditCommissionValidation;
            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();

            if (creditRequest.IndividualClientId.HasValue)
            {
                notificationService.SendCreditRequestIsProcessedBySecurity(creditRequest.IndividualClientId.Value,
                    ClientType.Individual, creditRequest.Id.ToString());
            } 
            else if (creditRequest.JuridicalClientId.HasValue)
            {
                notificationService.SendCreditRequestIsProcessedBySecurity(creditRequest.JuridicalClientId.Value,
                    ClientType.JuridicalPerson, creditRequest.Id.ToString());
            }

            return AutoMapper.Mapper.Map<CreditRequest, CreditRequestListItemViewModel>(creditRequest);
        }

        public CreditRequestListItemViewModel CreateCreditRequest(CreditRequestViewModel creditRequestViewModel)
        {
            var creditRequest = AutoMapper.Mapper.Map<CreditRequestViewModel, CreditRequest>(creditRequestViewModel);
            creditRequest.Status = CreditRequestStatus.AwaitingSecurityValidation;
            if (creditRequestViewModel.Attachments != null)
            {
                this.attachmentService.SaveAttachmentHeader(creditRequestViewModel.Attachments.ToList(), creditRequest);
            }

            creditUow.CreditRequests.InsertOrUpdate(creditRequest);
            creditUow.Commit();

            SendNotificationForNewCreditRequest(creditRequestViewModel, creditRequest.Id);

            return AutoMapper.Mapper.
                Map<CreditRequest, CreditRequestListItemViewModel>(creditUow.CreditRequests.GetFullCreditRequest(creditRequest.Id));
        }

        private void SendNotificationForNewCreditRequest(CreditRequestViewModel creditRequest, long id)
        {
            notificationService.SendNewCreditRequestCreated(creditRequest.ClientId.Value, creditRequest.ClientType, id.ToString());
        }
    }
}
