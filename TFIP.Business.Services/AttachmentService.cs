using System;
using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class AttachmentService : IAttachmentService
    {
        private readonly ICreditUow creditUow;
        private readonly IFileManagementService fileManagementService;

        public AttachmentService(
            ICreditUow creditUow,
            IFileManagementService fileManagementService)
        {
            this.creditUow = creditUow;
            this.fileManagementService = fileManagementService;
        }

        public void SaveAttachmentHeader<T>(ICollection<ListItem> attachments,
            T entityWithAttach) where T : IEntityWithAttachments
        {
            var attachmentHeader = GetOrCreateAttachmentHeader(attachments, entityWithAttach);
            if (attachmentHeader == null)
            {
                return;
            }

            creditUow.AttachmentHeaders.InsertOrUpdate(attachmentHeader, true);
            long attachmentId;
            UpdateExistingAttachments(attachments.Where(a => a.AdditionalInfo != null && long.TryParse(a.AdditionalInfo, out attachmentId)), attachmentHeader);
            AddNewAttachments(attachments.Where(a => string.IsNullOrEmpty(a.AdditionalInfo)), attachmentHeader);
        }
        
        public void RemoveAttachments(AttachmentHeader attachmentHeader)
        {
            if (attachmentHeader == null || attachmentHeader.Attachments == null || !attachmentHeader.Attachments.Any())
            {
                return;
            }

            var attachments = attachmentHeader.Attachments;
            RemoveAttachments(attachments);
            creditUow.AttachmentHeaders.Delete(attachmentHeader);
        }

        public void RemoveAttachments(IEnumerable<Attachment> attachments)
        {
            if (attachments == null)
            {
                return;
            }

            foreach (var attachment in attachments.ToList())
            {
                fileManagementService.RemoveAttachment(new ListItem
                {
                    Value = attachment.FileName,
                    Id = attachment.UniqueFolder.ToString(),
                    AdditionalInfo = attachment.Id.ToString()
                });

                creditUow.Attachments.Delete(attachment);
            }
        }

        private void UpdateExistingAttachments(IEnumerable<ListItem> attachments,
            AttachmentHeader attachmentHeader)
        {
            var originalAttachments = creditUow.Attachments.All()
                .Where(a => a.AttachmentHeaderId == attachmentHeader.Id);
            var modification = CollectionModificationResolver.Resolve(attachments, originalAttachments,
                (income, viewModel) => income.Id == long.Parse(viewModel.AdditionalInfo));

            RemoveAttachments(modification.Deleted);
        }

        private void AddNewAttachments(IEnumerable<ListItem> attachments, AttachmentHeader attachmentHeader)
        {
            foreach (var attachmentViewModel in attachments)
            {
                var attachment = new Attachment
                {
                    CreatedAt = DateTime.Now,
                    CreatedBy = string.Empty, // TODO: Get current user,
                    FileName = attachmentViewModel.Value,
                    AttachmentHeader = attachmentHeader,
                    UniqueFolder = Guid.Parse(attachmentViewModel.Id)
                };

                creditUow.Attachments.InsertOrUpdate(attachment);
            }
        }

        private AttachmentHeader GetOrCreateAttachmentHeader<T>(IEnumerable<ListItem> attachments,
            T entityWithAttach) where T : IEntityWithAttachments
        {
            if (entityWithAttach.AttachmentHeaderId.HasValue)
            {
                return creditUow.AttachmentHeaders.GetById(entityWithAttach.AttachmentHeaderId.Value);
            }

            if (!entityWithAttach.AttachmentHeaderId.HasValue && attachments.Any())
            {
                var header = new AttachmentHeader();
                entityWithAttach.AttachmentHeader = header;
                return header;
            }

            return null;
        }

        public ICollection<ListItem> GetAttachments(long? attachmentHeaderId)
        {
            if (!attachmentHeaderId.HasValue)
            {
                return Enumerable.Empty<ListItem>().ToList();
            }

            var attachments = GetDbAttachments(attachmentHeaderId.Value);
            return AutoMapper.Mapper.Map<IEnumerable<Attachment>, ICollection<ListItem>>(attachments);
        }

        private IEnumerable<Attachment> GetDbAttachments(long attachmentHeaderId)
        {
            var attachmentHeader = creditUow.AttachmentHeaders.All()
                .FirstOrDefault(it => it.Id == attachmentHeaderId);

            if (attachmentHeader == null || attachmentHeader.Attachments == null)
            {
                return Enumerable.Empty<Attachment>();
            }

            return attachmentHeader.Attachments;
        }
    }
}
