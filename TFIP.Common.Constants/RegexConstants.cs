namespace TFIP.Common.Constants
{
    public class RegexConstants
    {
        /// <summary>
        /// [A-ZА-Я]+
        /// </summary>
        public const string Characters = "[A-ZА-Яa-zа-я]+";

        /// <summary>
        /// [A-ZА-Я\\s
        /// </summary>
        public const string CharactersWithSpace = "[A-ZА-Яa-zа-я\\s]+";

        /// <summary>
        /// [\\d]+
        /// </summary>
        public const string Number = "[\\d]+";

        /// <summary>
        /// [A-Z0-9]{2,14}
        /// </summary>
        public const string NumberWithCharacters2_14 = "[A-Z0-9]{2,14}";

        /// <summary>
        /// [A-Z0-9]{2,9}
        /// </summary>
        public const string NumberWithCharacters2_9 = "[A-Z0-9]{2,9}";

        /// <summary>
        /// [A-Z0-9-]+
        /// </summary>
        public const string ZipCode = "[A-Z0-9-]+";

        /// <summary>
        /// [A-ZА-Я'-]+
        /// </summary>
        public const string LastName = "[A-ZА-Яa-zа-я'-]+";

        /// <summary>
        /// [A-ZА-Я0-9'-\\s]+
        /// </summary>
        public const string Address = @"[A-ZА-Яa-zа-я0-9\'\-\s]+";

        /// <summary>
        /// [A-ZА-Я0-9.'-]+
        /// </summary>
        public const string AddressNo = "[A-ZА-Яa-zа-я0-9.'-]+";
    }
}
