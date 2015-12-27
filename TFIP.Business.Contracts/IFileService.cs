using System.IO;

namespace TFIP.Business.Contracts
{
    public interface IFileService
    {
        void Move(string from, string to);
        void Rename(string sourceFileName, string destFileName);
        byte[] ReadAllBytes(string filePath);
        string ReadToEnd(string filePath);
        bool CheckIfFileExist(string filePath);
        string GetMD5Hash(string filename);
        FileStream Create(string path);
        bool DeleteDirectoryIfExists(string path);
        void MoveFileTo(string sourceFileName, string destinationFolder);
        Stream GetFileStream(string filePath);
    }
}
