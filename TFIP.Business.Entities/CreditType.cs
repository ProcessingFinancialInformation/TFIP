namespace TFIP.Business.Entities
{
    public class CreditType : Entity
    {
        public bool IsIndividual { get; set; }

        public string Name { get; set; }

        public CreditKind CreditKind { get; set; }

        public decimal Rate { get; set; }

        public int Term { get; set; }

        public decimal Amount { get; set; }

        public Currency Currency { get; set; }

        public bool IsGuarantorRequired { get; set; }

        public bool IsInquiriesRequired { get; set; }

        public MoneyType MoneyType { get; set; } 
    }
}
