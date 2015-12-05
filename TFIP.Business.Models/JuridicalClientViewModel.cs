using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class JuridicalClientViewModel
    {
        public long Id { get; set; }

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
        [RegularExpression(RegexConstants.Characters)]
        public string RepresenterFirstName { get; set; }

        /// <summary>
        /// Фамилия представителя
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Characters)]
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
        public int PAN { get; set; }

        /// <summary>
        /// Регистрационный номер
        /// </summary>
        [Required]
        [RegularExpression(RegexConstants.Number)]
        public int RegistrationNumber { get; set; }

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
        [RegularExpression(RegexConstants.Number)]
        public byte BankCode { get; set; }

        [Required]
        [RegularExpression("[A-Z-]+")]
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

        [Required]
        [Phone]
        public string ContactPhone { get; set; }

        [Required]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        public int CoutryId { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string RegistrationStreet { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }

        
    }
}
