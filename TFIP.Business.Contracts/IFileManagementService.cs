using System.Collections.Generic;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    using System.IO;

    public interface IFileManagementService
    {
        ListItem SaveAttachmentToTempFolder(FileViewModel fileViewModel);

        string GetFilePath(ListItem selectedFile);

        FileViewModel GetFile(ListItem file);

        void RenameFile(ListItem file, string newName, string storage);

        void RemoveAttachment(ListItem attachment);

        void RemoveTempAttachment(ListItem attachment);

        bool FileExists(ListItem file);

        byte[] GetFileBytes(ListItem file);

        Stream GetFileStream(ListItem file);

        void MoveTemporaryAttachmentsToStorage(IEnumerable<string> foldersToCheck);
    }
}
