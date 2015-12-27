namespace TFIP.Common.Helpers
{
    public enum Capability
    {
        CreateCreditRequest = 1,
        ApproveCreditRequest = 2,
        MIDInformation = 3,
        NBRBInformation = 4,
        MakePayment = 5,
        ClientInformation = 254,
        AdminPermissions = 255
    }
}
