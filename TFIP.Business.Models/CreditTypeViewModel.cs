using System.ComponentModel.DataAnnotations;
using TFIP.Business.Entities;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class CreditTypeViewModel
    {
        public long Id { get; set; }

        public bool IsIndividual { get; set; }

        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string Name { get; set; }

        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string Description { get; set; }

        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string Conditions { get; set; }

        public CreditKind CreditKind { get; set; }

        [Range(0.0, 200.0)]
        public decimal Rate { get; set; }

        /// <summary>
        /// Term in months.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int Term { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        public Currency Currency { get; set; }

        public bool IsGuarantorRequired { get; set; }

        public bool IsDocumentsRequired { get; set; }

        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string RequiredDocuments { get; set; }

        public MoneyType MoneyType { get; set; }

        /// <summary>
        /// In hours.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int TermOfApplication { get; set; }

        public bool IsActive { get; set; }

        public string DisplayMoneyType { get; set; }

        public string DisplayCurrency { get; set; }

        public string DisplayCreditKind { get; set; }
    }
}
