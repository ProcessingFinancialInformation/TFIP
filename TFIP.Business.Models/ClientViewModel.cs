using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class ClientViewModel
    {
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

        [Required]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        [Phone]
        public string ContactPhone { get; set; }
    }
}
