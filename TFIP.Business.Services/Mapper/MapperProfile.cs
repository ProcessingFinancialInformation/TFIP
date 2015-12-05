using System.Collections.Generic;
using AutoMapper;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Common.Helpers;

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

            AutoMapper.Mapper.CreateMap<JuridicalClientViewModel, JuridicalClient>()
                .ForMember(ic => ic.AttachmentHeader, option => option.Ignore())
                .ForMember(ic => ic.AttachmentHeaderId, option => option.Ignore())
                .ForMember(ic => ic.CreditRequests, option => option.Ignore());

            ConfigureCountry();
            ConfigureAttachments();
            ConfigureSettings();

            // Use mapper profile service to get info from database if necessary.
            // Mapper.CreateMap ...
        }

        private void ConfigureAttachments()
        {
            AutoMapper.Mapper.CreateMap<Attachment, ListItem>()
                .ForMember(vm => vm.Id, opt => opt.MapFrom(m => m.UniqueFolder.ToString()))
                .ForMember(vm => vm.Value, opt => opt.MapFrom(m => m.FileName))
                .ForMember(vm => vm.AdditionalInfo, opt => opt.MapFrom(m => new List<string> {m.Id.ToString()}));
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

        private void ConfigureSettings()
        {
            AutoMapper.Mapper.CreateMap<Setting, ListItem>()
                .ForMember(dest => dest.Id, x => x.MapFrom(source => source.Id))
                .ForMember(dest => dest.AdditionalInfo,
                    x => x.MapFrom(source => EnumHelper.GetEnumDescription(source.SettingName)))
                .ForMember(dest => dest.Value, x => x.MapFrom(source => source.SettingValue));
        }
    }
}
