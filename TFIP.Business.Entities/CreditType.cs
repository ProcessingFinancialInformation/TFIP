namespace TFIP.Business.Entities
{
    public class CreditType : Entity
    {
        public bool IsIndividual { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Conditions { get; set; }

        public CreditKind CreditKind { get; set; }

        public decimal Rate { get; set; }

        /// <summary>
        /// Term in months.
        /// </summary>
        public int Term { get; set; }

        public decimal Amount { get; set; }

        public Currency Currency { get; set; }

        public bool IsGuarantorRequired { get; set; }

        public bool IsDocumentsRequired { get; set; }

        public string RequiredDocuments { get; set; } 

        public MoneyType MoneyType { get; set; } 

        /// <summary>
        /// In hours.
        /// </summary>
        public int TermOfApplication { get; set; }

        public bool IsActive { get; set; }
    }
}
