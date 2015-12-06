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
            ConfigureJuridicalClient();
            ConfigureIndividualClient();
            ConfigureCountry();
            ConfigureAttachments();
            ConfigureSettings();
            ConfigureCreditTypes();
            // Use mapper profile service to get info from database if necessary.
            // Mapper.CreateMap ...
        }

        private void ConfigureCreditTypes()
        {
            AutoMapper.Mapper.CreateMap<CreditTypeViewModel, CreditType>();
            AutoMapper.Mapper.CreateMap<CreditType, CreditTypeViewModel>()
                .ForMember(vm => vm.DisplayCreditKind, opt => opt.MapFrom(m => EnumHelper.GetEnumDescription(m.CreditKind)))
                .ForMember(vm => vm.DisplayCurrency, opt => opt.MapFrom(m => EnumHelper.GetEnumDescription(m.Currency)))
                .ForMember(vm => vm.DisplayMoneyType, opt => opt.MapFrom(m => EnumHelper.GetEnumDescription(m.MoneyType)));
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

        private void ConfigureIndividualClient()
        {
            AutoMapper.Mapper.CreateMap<CreateIndividualClientViewModel, IndividualClient>()
                .ForMember(ic => ic.AttachmentHeader, option => option.Ignore())
                .ForMember(ic => ic.AttachmentHeaderId, option => option.Ignore())
                .ForMember(ic => ic.CreditRequests, option => option.Ignore());
            AutoMapper.Mapper.CreateMap<CreditRequest, CreditRequestListItemViewModel>()
                .ForMember(i => i.CreditKind, source => source.MapFrom(x => EnumHelper.GetEnumDescription(x.CreditType.CreditKind)))
                .ForMember(i => i.CreditName, source => source.MapFrom(x => x.CreditType.Name));
            AutoMapper.Mapper.CreateMap<IndividualClient, IndividualClientInfoViewModel>()
                .ForMember(ic => ic.Credits, option => option.MapFrom(source => source.CreditRequests));
        }

        private void ConfigureJuridicalClient()
        {
            AutoMapper.Mapper.CreateMap<CreateJuridicalClientViewModel, JuridicalClient>()
                .ForMember(ic => ic.AttachmentHeader, option => option.Ignore())
                .ForMember(ic => ic.AttachmentHeaderId, option => option.Ignore())
                .ForMember(ic => ic.CreditRequests, option => option.Ignore());
            AutoMapper.Mapper.CreateMap<JuridicalClient, JuridicalClientInfoViewModel>()
                .ForMember(ic => ic.Credits, option => option.MapFrom(source => source.CreditRequests));
        }
    }
}
