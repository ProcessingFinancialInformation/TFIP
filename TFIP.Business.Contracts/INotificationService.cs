using System;
using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Contracts
{
    public interface INotificationService
    {
        bool SendNewCreditRequestCreated(long requestId, string requestNumber);

        bool SendCreditRequestIsProcessed(string clientName, string clientEmail,
            CreditRequestStatus requestStatus);

        bool SendCreditRequestIsProcessedBySecurity(long requestId, string requestNumber);

        bool SendNotificationWithException(IEnumerable<string> recepients, Exception exception,
            string url, string data);
    }
}
