namespace TFIP.Business.Entities
{
    public interface IEntityWithAttachments
    {
        AttachmentHeader AttachmentHeader { get; set; }

        long? AttachmentHeaderId { get; set; }
    }
}
