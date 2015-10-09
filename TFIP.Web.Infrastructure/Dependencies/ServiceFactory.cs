using System.Web.Mvc;
using TFIP.Business.Contracts;

namespace TFIP.Web.Infrastructure.Dependencies
{
    public class ServiceFactory : IServiceFactory
    {
        public T GetService<T>()
        {
            return DependencyResolver.Current.GetService<T>();
        }
    }
}
