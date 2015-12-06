using System;
using System.ComponentModel.DataAnnotations;

namespace TFIP.Business.Entities
{
    public class PersonClient : Client
    {
        [MaxLength(9)]
        public string PassportNo { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Patronymic { get; set; }

        public Gender Gender { get; set; }

        public string Nationality { get; set; }

        public string PlaceOfBirth { get; set; }

        public string Authority { get; set; }

        public DateTime DateOfIssue { get; set; }

        public DateTime DateOfExpiry { get; set; }

        public DateTime DateOfBirth { get; set; }
    }
}
