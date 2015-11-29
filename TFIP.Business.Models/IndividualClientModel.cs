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
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Patronymic { get; set; }

        public Gender Gender { get; set; }

        public string Nationality { get; set; }

        public string PlaceOfBirth { get; set; }

        public string Authority { get; set; }

        public DateTime DateOfIssue { get; set; }

        public DateTime DateOfExpiry { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string RegistrationCountry { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
