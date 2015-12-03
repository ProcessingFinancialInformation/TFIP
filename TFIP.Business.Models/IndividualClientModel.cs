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
        [RegularExpression("[A-Z 1-9]{2,14}")]
        public string IdentificationNo { get; set; }

        [Required]
        [RegularExpression("[A-Z 1-9]{2,9}")]
        public int PassportNo { get; set; }

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
        [RegularExpression("[A-Z А-Я][а-я  a-z ]+")]
        public string PlaceOfBirth { get; set; }

        [Required]
        public string Authority { get; set; }

        [Required]
        public DateTime DateOfIssue { get; set; }

        [Required]
        public DateTime DateOfExpiry { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public int CoutryId { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z 1-9 '-]+")]
        public string RegistrationCity { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я][а-я  a-z 1-9 '-]+")]
        public string RegistrationRegion { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        [RegularExpression("[A-Z А-Я а-я  a-z 1-9 . '-]+")]
        public string HouseNo { get; set; }

        [Required]
        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
