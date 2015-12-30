namespace TFIP.Business.Models
{
    using System.ComponentModel.DataAnnotations;

    using TFIP.Business.Entities;
    using TFIP.Common.Constants;

    /// <summary>
    /// The credit type view model.
    /// </summary>
    public class CreditTypeViewModel
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        /// <summary>
        /// Gets or sets the calculation type.
        /// </summary>
        [Required]
        public CalculationType CalculationType { get; set; }

        /// <summary>
        /// Gets or sets the conditions.
        /// </summary>
        [Required]
        public string Conditions { get; set; }

        /// <summary>
        /// Gets or sets the credit kind.
        /// </summary>
        public CreditKind CreditKind { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the display credit kind.
        /// </summary>
        public string DisplayCreditKind { get; set; }


        [Range(0, double.MaxValue)]
        public decimal? AmountFrom { get; set; }

        
        [Range(0, double.MaxValue)]
        public decimal? AmountTo { get; set; }

        public Currency Currency { get; set; }

        /// <summary>
        /// Gets or sets the display currency.
        /// </summary>
        public string DisplayCurrency { get; set; }

        /// <summary>
        /// Gets or sets the display money type.
        /// </summary>
        public string DisplayMoneyType { get; set; }

        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether is active.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether is documents required.
        /// </summary>
        public bool IsDocumentsRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether is guarantor required.
        /// </summary>
        public bool IsGuarantorRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether is individual.
        /// </summary>
        public bool IsIndividual { get; set; }

        /// <summary>
        /// Gets or sets the money type.
        /// </summary>
        public MoneyType MoneyType { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the rate.
        /// </summary>
        [Range(0.0, 200.0)]
        public decimal Rate { get; set; }

        /// <summary>
        /// Gets or sets the required documents.
        /// </summary>
        public string RequiredDocuments { get; set; }

        /// <summary>
        ///     Term in months.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int Term { get; set; }

        /// <summary>
        ///     In hours.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int TermOfApplication { get; set; }

        #endregion
    }
}