using System;
using System.ComponentModel.DataAnnotations;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class ClientViewModel
    {
        public bool IsNew
        {
            get
            {
                return this.Id == 0;
            }
        }

        public long Id { get; set; }

        [Required]
        public int CountryId { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Address)]
        public string RegistrationCity { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Address)]
        public string RegistrationRegion { get; set; }

        [Required]
        public string RegistrationStreet { get; set; }

        [Required]
        [RegularExpression(RegexConstants.AddressNo)]
        public string HouseNo { get; set; }

        [RegularExpression(RegexConstants.AddressNo)]
        public string FlatNo { get; set; }

        [Required]
        public DateTime RegistrationDate { get; set; }

        public string ContactEmail { get; set; }

        [Required]
        [Phone]
        public string ContactPhone { get; set; }
    }
}
