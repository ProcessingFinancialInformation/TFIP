using System;
using System.Collections.Generic;
using System.IO;
using TFIP.Business.Contracts;
using TFIP.Business.Models;
using TFIP.Common.Helpers;
using TFIP.Common.Logging;

namespace TFIP.Business.Services
{
    public class FileManagementService : IFileManagementService
    {
        private readonly IFileService fileService;

        public FileManagementService(
            IFileService fileService)
        {
            this.fileService = fileService;
        }

        public ListItem SaveAttachmentToTempFolder(FileViewModel fileViewModel)
        {
            var folderName = Guid.NewGuid().ToString();
            var path = Path.Combine(ConfigurationHelper.GetTemporaryFilesFolder(), folderName);
            Directory.CreateDirectory(path);
            using (var file = File.Create(Path.Combine(path, fileViewModel.FileName)))
            {
                fileViewModel.InputStream.CopyTo(file);
            }

            return new ListItem()
            {
                Value = fileViewModel.FileName,
                Id = folderName
            };
        }

        public string GetFilePath(ListItem selectedFile)
        {
            string storage = IsAttachmentSaved(selectedFile)
                ? ConfigurationHelper.GetFilesStorageFolder()
                : ConfigurationHelper.GetTemporaryFilesFolder();
            var path = Path.Combine(storage, selectedFile.Id, selectedFile.Value);
            return path;
        }

        public FileViewModel GetFile(ListItem file)
        {
            var path = Path.Combine(ConfigurationHelper.GetTemporaryFilesFolder(), file.Id, file.Value);
            if (File.Exists(path))
            {
                FileStream fsSource = null;
                try
                {
                    fsSource = new FileStream(path, FileMode.Open, FileAccess.Read);
                    var viewModel = new FileViewModel
                    {
                        FileName = file.Value,
                        InputStream = fsSource
                    };
                    return viewModel;
                }
                catch (Exception ex)
                {
                    if (fsSource != null)
                    {
                        fsSource.Dispose();
                    }

                    throw;
                }
            }

            return null;
        }

        public byte[] GetFileBytes(ListItem file)
        {
            if (IsAttachmentSaved(file))
            {
                return ReadSavedAttachment(file);
            }
            return ReadFileFromTemplateStorageBytes(file);
        }

        public void RenameFile(ListItem file, string newName, string storage)
        {
            if (ExistsInStorage(file, storage))
            {
                var oldPath = GenerateFilepath(file.Value, file.Id, storage);
                var newPath = GenerateFilepath(newName, file.Id, storage);
                fileService.Rename(oldPath, newPath);
            }
        }

        public void RemoveAttachment(ListItem attachment)
        {
            if (attachment == null)
            {
                CommonLogger.Info("Attachment is null");
                return;
            }
            if (IsAttachmentSaved(attachment))
            {
                if (ExistsInSavedStorage(attachment))
                {
                    var isFileRemoved = TryRemoveFile(attachment, ConfigurationHelper.GetFilesStorageFolder()) ||
                        TryRemoveFile(attachment, ConfigurationHelper.GetTemporaryFilesFolder());
                    return;
                }
            }
            RemoveTempAttachment(attachment);
        }

        public void MoveTemporaryAttachmentsToStorage(IEnumerable<string> foldersToCheck)
        {
            var localStoragePath = ConfigurationHelper.GetTemporaryFilesFolder();
            foreach (var folder in foldersToCheck)
            {
                var localPath = Path.Combine(localStoragePath, folder);
                if (Directory.Exists(localPath))
                {
                    TrySaveAttachmentToNetworkStorage(folder);
                }
            }
        }

        public void RemoveTempAttachment(ListItem attachment)
        {
            if (!IsAttachmentSaved(attachment))
            {
                TryRemoveFile(attachment, ConfigurationHelper.GetTemporaryFilesFolder());
            }
        }

        public bool FileExists(ListItem file)
        {
            if (IsAttachmentSaved(file))
            {
                return ExistsInSavedStorage(file);
            }
            return ExistsInStorage(file, ConfigurationHelper.GetTemporaryFilesFolder());
        }

        private bool TryRemoveFile(ListItem attachment, string storagePath)
        {
            var path = Path.Combine(storagePath, attachment.Id);
            return fileService.DeleteDirectoryIfExists(path);
        }

        private bool TrySaveAttachmentToNetworkStorage(string uniqueFolder)
        {
            var localFolderPath = Path.Combine(ConfigurationHelper.GetTemporaryFilesFolder(), uniqueFolder);
            var networkFolderPath = Path.Combine(ConfigurationHelper.GetFilesStorageFolder(), uniqueFolder);

            if (localFolderPath == networkFolderPath)
            {
                return true;
            }

            fileService.Move(localFolderPath, networkFolderPath);

            return true;
        }

        private byte[] ReadFileFromTemplateStorageBytes(ListItem file)
        {
            var templateFilesFolder = ConfigurationHelper.GetTemporaryFilesFolder();
            if (ExistsInStorage(file, templateFilesFolder))
            {
                return fileService.ReadAllBytes(Path.Combine(templateFilesFolder, file.Id, file.Value));
            }

            return null;
        }

        private byte[] ReadFileFromNetworkStorageBytes(ListItem file)
        {
            var networkStorage = ConfigurationHelper.GetFilesStorageFolder();

            if (ExistsInStorage(file, networkStorage))
            {
                return fileService.ReadAllBytes(Path.Combine(networkStorage, file.Id, file.Value));
            }

            return null;
        }

        private byte[] ReadSavedAttachment(ListItem file)
        {
            return ReadFileFromNetworkStorageBytes(file) ?? ReadFileFromTemplateStorageBytes(file);
        }

        private string GenerateFilepath(string filename, string folder, string storagePath)
        {
            var path = Path.Combine(storagePath, folder, filename);
            return path;
        }

        private bool ExistsInSavedStorage(ListItem selectedFile)
        {
            if (ExistsInStorage(selectedFile, ConfigurationHelper.GetFilesStorageFolder()))
            {
                return true;
            }

            return ExistsInStorage(selectedFile, ConfigurationHelper.GetTemporaryFilesFolder());
        }

        private bool ExistsInStorage(ListItem file, string storagePath)
        {
            var path = GenerateFilepath(file.Value, file.Id, storagePath);
            return fileService.CheckIfFileExist(path);
        }

        private bool IsAttachmentSaved(ListItem file)
        {
            long attachmentId;
            return long.TryParse(file.AdditionalInfo, out attachmentId);
        }
    }
}