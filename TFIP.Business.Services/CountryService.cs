using System.Collections.Generic;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    using TFIP.Business.Contracts;

    public class CountryService : ICountryService
    {
        private readonly ICreditUow creditUow;

        public CountryService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public IEnumerable<ListItem> GetCountries()
        {
            return AutoMapper.Mapper.Map<IEnumerable<Country>, IEnumerable<ListItem>>(creditUow.Countries.All());
        } 
    }
}
