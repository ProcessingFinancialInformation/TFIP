using System.Data.Entity;
using Autofac;
using TFIP.Common.Constants;
using TFIP.Data;
using TFIP.Data.Contracts;
using TFIP.Data.Helpers;
using TFIP.Data.MIA;
using TFIP.Data.NBRB;

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
                .WithParameter("connectionStringName", DataAccessLayerConstants.CreditDatabaseConnectionStringName)
                .InstancePerRequest();

            builder.RegisterType<MiaDbContext>()
                .As<MiaDbContext>()
                .WithParameter("connectionStringName", DataAccessLayerConstants.MIADatabaseConnectionStringName)
                .InstancePerRequest();

            builder.RegisterType<NbrbDbContext>()
                .As<NbrbDbContext>()
                .WithParameter("connectionStringName", DataAccessLayerConstants.NBRBDatabaseConnectionStringName)
                .InstancePerRequest();

            builder.RegisterType<RepositoryFactories>()
                .AsSelf()
                .SingleInstance();

            builder.RegisterAssemblyTypes(typeof (CreditUow).Assembly)
                .Where(t => t.Name.EndsWith("Uow"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(typeof(MiaUow).Assembly)
                .Where(t => t.Name.EndsWith("Uow"))
                .AsImplementedInterfaces();

            builder.RegisterAssemblyTypes(typeof(NbrbUow).Assembly)
                .Where(t => t.Name.EndsWith("Uow"))
                .AsImplementedInterfaces();
        }
    }
}
