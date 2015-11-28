using System;

namespace TFIP.Business.Entities
{
    public class IndividualClient : Client
    {
        public string PassportSeries { get; set; }

        public int PassportNumber { get; set; }

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

        public string RegistrationCountry { get; set; }

        public string RegistrationCity { get; set; }

        public string RegistrationRegion { get; set; }

        public string HouseNo { get; set; }

        public string FlatNo { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
