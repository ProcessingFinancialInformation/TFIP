using System;
using TFIP.Business.Entities;
using System.ComponentModel.DataAnnotations;
using TFIP.Common.Constants;

namespace TFIP.Business.Models
{
    public class CreateIndividualClientViewModel: ClientViewModel
    {
        [Required]
        [RegularExpression(RegexConstants.NumberWithCharacters2_14)]
        public string IdentificationNo { get; set; }

        [Required]
        [RegularExpression(RegexConstants.NumberWithCharacters2_9)]
        public string PassportNo { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Characters)]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression(RegexConstants.LastName)]
        public string LastName { get; set; }

        [RegularExpression(RegexConstants.Characters)]
        public string Patronymic { get; set; }

        public Gender Gender { get; set; }

        [Required]
        [RegularExpression(RegexConstants.Characters)]
        public string Nationality { get; set; }

        [Required]
        [RegularExpression(RegexConstants.CharactersWithSpace)]
        public string PlaceOfBirth { get; set; }

        [Required]
        public string Authority { get; set; }

        [Required]
        public DateTime DateOfIssue { get; set; }

        [Required]
        public DateTime DateOfExpiry { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        
    }
}
