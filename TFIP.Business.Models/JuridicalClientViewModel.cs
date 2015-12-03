using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;

namespace TFIP.Business.Models
{
    public class JuridicalClientViewModel
    {

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
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string RepresenterFirstName { get; set; }

        /// <summary>
        /// Фамилия представителя
        /// </summary>
        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string RepresenterLastName { get; set; }

        /// <summary>
        /// Отчество представителя
        /// </summary>
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string RepresenterPatronymic { get; set; }

        /// <summary>
        /// Должность представителя
        /// </summary>
        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string RepresenterPosition { get; set; }

        /// <summary>
        /// УНП
        /// </summary>
        public int PAN { get; set; }

        /// <summary>
        /// Регистрационный номер
        /// </summary>
        public int RegistrationNumber { get; set; }

        /// <summary>
        /// Регистрирующий орган
        /// </summary>
        public string RegistrationOrganisation { get; set; }

        /// <summary>
        /// Расчетный счет
        /// </summary>
        public long CheckingAccount { get; set; }

        /// <summary>
        /// Наименование банка
        /// </summary>
        public string BankName { get; set; }

        /// <summary>
        /// Код банка
        /// </summary>
        public byte BankCode { get; set; }

        public string Zip { get; set; }

        public string ContactFirstName { get; set; }

        public string ContactLastName { get; set; }

        public string ContactPatronymic { get; set; }

        public string ContactFax { get; set; }

        public int CoutryId { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string RegistrationStreet { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string ContactEmail { get; set; }

        public string ContactPhone { get; set; }
    }
}
