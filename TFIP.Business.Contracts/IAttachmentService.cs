using System.Collections.Generic;
using TFIP.Business.Entities;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IAttachmentService
    {
        void SaveAttachmentHeader<T>(ICollection<ListItem> attachments,
            T entityWithAttach) where T : IEntityWithAttachments;

        void RemoveAttachments(AttachmentHeader attachmentHeader);

        void RemoveAttachments(IEnumerable<Attachment> attachments);

        ICollection<ListItem> GetAttachments(long? attachmentHeaderId);
    }
}
