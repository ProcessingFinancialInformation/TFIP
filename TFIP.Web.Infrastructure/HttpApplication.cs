using System.Collections.Generic;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using TFIP.Business.Services;

namespace TFIP.Web.Infrastructure
{
    public abstract class HttpApplication : System.Web.HttpApplication
    {
        private static IContainer container;

        private AutomapperConfigurator automapperConfigurator;
        
        protected abstract void Register();

        protected void Application_Start()
        {
            BootstrapContainer();

            automapperConfigurator = DependencyResolver.Current.GetService<AutomapperConfigurator>();
            automapperConfigurator.Configure();

            // For additional configurations in each application.
            Register();
        }

        private void BootstrapContainer()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(GetWebAssembly())
                .AsSelf();

            builder.RegisterApiControllers(GetWebAssembly());

            builder.RegisterAssemblyModules(GetExecutingAssemblies());

            container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private Assembly[] GetExecutingAssemblies()
        {
            var assebmlies = new List<Assembly>
            {
                Assembly.GetExecutingAssembly(),
                GetWebAssembly()
            };
            return assebmlies.ToArray();
        }

        protected abstract Assembly GetWebAssembly();
        
        protected void Application_End()
        {
            container.Dispose();
        }
    }
}
