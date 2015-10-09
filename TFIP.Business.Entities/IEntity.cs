namespace TFIP.Business.Entities
{
    public interface IEntity
    {
        long Id { get; set; }

        bool IsNew();
    }
}
