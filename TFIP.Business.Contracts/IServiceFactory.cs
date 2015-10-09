namespace TFIP.Business.Contracts
{
    public interface IServiceFactory
    {
        T GetService<T>();
    }
}
