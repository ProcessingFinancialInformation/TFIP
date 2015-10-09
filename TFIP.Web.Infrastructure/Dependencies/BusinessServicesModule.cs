using Autofac;
using TFIP.Business.Contracts;
using TFIP.Business.Services;

namespace TFIP.Web.Infrastructure.Dependencies
{
    public class BusinessServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof (NotificationService).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces();


            builder.RegisterType<ServiceFactory>()
                .As<IServiceFactory>()
                .SingleInstance();
        }
    }
}
