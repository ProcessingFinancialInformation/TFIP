using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;
using System.ComponentModel.DataAnnotations;

namespace TFIP.Business.Models
{
    public class IndividualClientModel
    {

        public long Id { get; set; }

        [Required]
        public string IdentificationNo { get; set; }

        [Required]
        public string PassportSeries { get; set; }

        public int PassportNumber { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z '-]+")]
        public string LastName { get; set; }

        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string Patronymic { get; set; }

        public Gender Gender { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string Nationality { get; set; }

        [Required]
        public string PlaceOfBirth { get; set; }

        [Required]
        public string Authority { get; set; }

        public DateTime DateOfIssue { get; set; }

        public DateTime DateOfExpiry { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string RegistrationCountry { get; set; }

        [Required]
        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        [Required]
        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
