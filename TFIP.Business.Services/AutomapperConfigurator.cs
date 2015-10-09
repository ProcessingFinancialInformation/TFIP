using System.Collections.Generic;
using System.Linq;
using AutoMapper;

namespace TFIP.Business.Services
{
    public class AutomapperConfigurator
    {
        private readonly IEnumerable<Profile> profiles;

        public AutomapperConfigurator(IEnumerable<Profile> profiles)
        {
            this.profiles = profiles;
        }

        public void Configure()
        {
            AutoMapper.Mapper.Initialize(configuration => profiles
                .ToList()
                .ForEach(configuration.AddProfile));
        }
    }
}
