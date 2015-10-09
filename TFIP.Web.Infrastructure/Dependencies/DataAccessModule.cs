using System.Data.Entity;
using Autofac;
using TFIP.Data;
using TFIP.Data.Contracts;
using TFIP.Data.Helpers;

namespace TFIP.Web.Infrastructure.Dependencies
{
    public class DataAccessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RepositoryProvider>()
                .As<IRepositoryProvider>();

            builder.RegisterType<CreditDbContext>()
                .As<DbContext>()
                .WithParameter("connectionStringName", "CreditDbConnection")
                .InstancePerRequest();

            builder.RegisterType<RepositoryFactories>()
                .AsSelf()
                .SingleInstance();

            builder.RegisterAssemblyTypes(typeof (CreditUow).Assembly)
                .Where(t => t.Name.EndsWith("Uow"))
                .AsImplementedInterfaces();
        }
    }
}
