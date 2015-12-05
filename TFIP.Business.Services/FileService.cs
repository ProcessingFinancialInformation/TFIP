using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using TFIP.Business.Contracts;

namespace TFIP.Business.Services
{
    public class FileService : IFileService
    {
        public void MoveFileTo(string sourceFileName, string destinationFolder)
        {
            var file = new FileInfo(sourceFileName);

            VarifyFilder(destinationFolder);
            var destination = Path.Combine(destinationFolder, file.Name);
            file.MoveTo(destination);
        }

        private void VarifyFilder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
        public void Move(string from, string to)
        {
            VarifyFilder(to);

            foreach (var sourceFileName in Directory.GetFiles(from))
            {
                MoveFileTo(sourceFileName, to);
            }
            DeleteDirectoryIfExists(from);
        }

        public void Rename(string sourceFileName, string destFileName)
        {
            File.Move(sourceFileName, destFileName);
        }

        public byte[] ReadAllBytes(string filePath)
        {
            return File.ReadAllBytes(filePath);
        }
        public string ReadToEnd(string filePath)
        {
            return File.ReadAllText(filePath);
        }

        public bool CheckIfFileExist(string filePath)
        {
            return File.Exists(filePath);
        }

        public string GetMD5Hash(string filename)
        {
            using (var md5 = new MD5CryptoServiceProvider())
            {
                var buffer = md5.ComputeHash(File.ReadAllBytes(filename));
                var sb = new StringBuilder();
                foreach (byte b in buffer)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }

        public FileStream Create(string path)
        {
            return File.Create(path);
        }

        public bool DeleteDirectoryIfExists(string path)
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
                return true;
            }
            return false;
        }

        public static string ToRootedPath(string path)
        {
            if (Path.IsPathRooted(path))
            {
                return path;
            }
            var baseDirectoryPath = AppDomain.CurrentDomain.BaseDirectory;
            return Path.Combine(baseDirectoryPath, path);
        }
    }
}
