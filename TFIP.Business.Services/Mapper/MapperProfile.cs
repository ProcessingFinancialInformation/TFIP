using AutoMapper;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;

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
            AutoMapper.Mapper.CreateMap<IndividualClientViewModel, IndividualClient>()
                .ForMember(ic => ic.AttachmentHeader, option => option.Ignore())
                .ForMember(ic => ic.AttachmentHeaderId, option => option.Ignore())
                .ForMember(ic => ic.CreditRequests, option => option.Ignore());

            ConfigureCountry();

            // Use mapper profile service to get info from database if necessary.
            // Mapper.CreateMap ...
        }

        private void ConfigureCountry()
        {
            AutoMapper.Mapper.CreateMap<Country, ListItem>()
                .ForMember(dest => dest.Id, x => x.MapFrom(source => source.Id))
                .ForMember(dest => dest.Value, x => x.MapFrom(source => source.Name));

            AutoMapper.Mapper.CreateMap<ListItem, Country>()
                .ForMember(dest => dest.Id, x => x.MapFrom(source => source.Id))
                .ForMember(dest => dest.Name, x => x.MapFrom(source => source.Value));
        }
    }
}
