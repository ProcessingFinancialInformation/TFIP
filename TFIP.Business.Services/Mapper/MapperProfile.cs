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
            AutoMapper.Mapper.CreateMap<IndividualClientModel, IndividualClient>()
                .ForMember(ic => ic.AttachmentHeader, option => option.Ignore())
                .ForMember(ic => ic.AttachmentHeaderId, option => option.Ignore())
                .ForMember(ic => ic.CreditRequests, option => option.Ignore());
            // Use mapper profile service to get info from database if necessary.
            // Mapper.CreateMap ...
        }
    }
}
