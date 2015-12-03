namespace TFIP.Business.Entities
{
    public enum NotificationType
    {
        NewCreditRequest = 0,
        CreditRequestIsProccessedBySecurity = 1,
        CreditRequestIsProcessed = 2,
        UnhandledError = 255
    }
}
