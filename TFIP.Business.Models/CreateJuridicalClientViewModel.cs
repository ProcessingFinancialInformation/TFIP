using System;
using System.ComponentModel.DataAnnotations;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class CreateJuridicalClientViewModel: ClientViewModel
    {
        [Required]
        [RegularExpression(RegexConstants.Number)]
        public string IdentificationNo { get; set; }
        /// <summary>
        /// Название организации
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Имя представителя
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string RepresenterFirstName { get; set; }

        /// <summary>
        /// Фамилия представителя
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string RepresenterLastName { get; set; }

        /// <summary>
        /// Отчество представителя
        /// </summary>
        [RegularExpression(RegexConstants.Characters)]
        public string RepresenterPatronymic { get; set; }

        /// <summary>
        /// Должность представителя
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Characters)]
        public string RepresenterPosition { get; set; }

        /// <summary>
        /// УНП
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Number)]
        public string PAN { get; set; }

        /// <summary>
        /// Регистрационный номер
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Number)]
        public string RegistrationNumber { get; set; }

        /// <summary>
        /// Регистрирующий орган
        /// </summary>
        [Required]
        public string RegistrationOrganisation { get; set; }

        /// <summary>
        /// Расчетный счет
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Number)]
        public long CheckingAccount { get; set; }

        /// <summary>
        /// Наименование банка
        /// </summary>
        [Required]
        public string BankName { get; set; }

        /// <summary>
        /// Код банка
        /// </summary>
        [Required]
        [Range(100,999)]
        public int BankCode { get; set; }

        [Required]
        [RegularExpression(RegexConstants.ZipCode)]
        public string Zip { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Characters)]
        public string ContactFirstName { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Characters)]
        public string ContactLastName { get; set; }

        [RegularExpression(RegexConstants.Characters)]
        public string ContactPatronymic { get; set; }

        [Required]
        [Phone]
        public string ContactFax { get; set; }
    }
}
