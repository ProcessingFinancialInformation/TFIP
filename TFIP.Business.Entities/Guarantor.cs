namespace TFIP.Business.Entities
{
    public class Guarantor : PersonClient
    {
        public long CreditRequestId { get; set; }
        public virtual CreditRequest CreditRequest { get; set; }
    }
}
