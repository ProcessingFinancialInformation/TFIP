using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TFIP.Business.Entities
{
    public class JuridicalClient : Client
    {
        /// <summary>
        /// Название организации
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Имя представителя
        /// </summary>
        public string RepresenterFirstName { get; set; }

        /// <summary>
        /// Фамилия представителя
        /// </summary>
        public string RepresenterLastName { get; set; }

        /// <summary>
        /// Отчество представителя
        /// </summary>
        public string RepresenterPatronymic { get; set; }

        /// <summary>
        /// Должность представителя
        /// </summary>
        public string RepresenterPosition { get; set; }

        /// <summary>
        /// УНП
        /// </summary>
        [StringLength(20)]
        [Index(IsUnique = true)]
        public string PAN { get; set; }

        /// <summary>
        /// Регистрационный номер
        /// </summary>
        [StringLength(20)]
        [Index(IsUnique = true)]
        public string RegistrationNumber { get; set; }

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

    }
}
