using AutoMapper;
using TFIP.Business.Contracts;

namespace TFIP.Business.Services.Mapper
{
    public class MapperProfile : Profile
    {
        private IMapperProfileService mapperProfileService
        {
            get { return serviceFactory.GetService<IMapperProfileService>(); }
        }

        private readonly IServiceFactory serviceFactory;

        public MapperProfile(IServiceFactory serviceFactory)
        {
            this.serviceFactory = serviceFactory;
        }

        protected override void Configure()
        {
            // Use mapper profile service to get info from database if necessary.
            // Mapper.CreateMap ...
        }
    }
}
