using Autofac;
using AutoMapper;
using TFIP.Business.Contracts;
using TFIP.Business.NotificationModule.EmailTransport;
using TFIP.Business.Services;
using TFIP.Business.Services.Mapper;

namespace TFIP.Web.Infrastructure.Dependencies
{
    public class BusinessServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType(typeof(Business.NotificationModule.NotificationService))
                .AsImplementedInterfaces();

            builder.RegisterType(typeof(EmailTransport))
                .AsImplementedInterfaces();

            builder.RegisterType(typeof(EmailBuilder))
                .AsSelf();


            builder.RegisterAssemblyTypes(typeof (NotificationService).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces();

            builder.RegisterType(typeof (MapperProfile)).AsImplementedInterfaces().As(typeof (Profile));

            builder.RegisterType(typeof(AutomapperConfigurator))
                .AsSelf();

            builder.RegisterType<ServiceFactory>()
                .As<IServiceFactory>()
                .SingleInstance();
        }
    }
}
