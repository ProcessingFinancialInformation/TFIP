using System;
using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Contracts
{
    public interface INotificationService
    {
        bool SendNewCreditRequestCreated(long clientId, ClientType clientType, string requestNumber);

        bool SendCreditRequestIsProcessed(string clientName, string clientEmail,
            CreditRequestStatus requestStatus);

        bool SendCreditRequestIsProcessedBySecurity(long clientId, ClientType clientType, string requestNumber);

        bool SendNotificationWithException(IEnumerable<string> recepients, Exception exception,
            string url, string data);
    }
}
