namespace TFIP.Business.Contracts
{
    public interface INotificationService
    {
        bool SendNewCreditRequestCreated(long requestId, string requestNumber);
    }
}
