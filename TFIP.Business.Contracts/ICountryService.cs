using System.Collections.Generic;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface ICountryService
    {
        IEnumerable<ListItem> GetCountries();
    }
}
