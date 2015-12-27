namespace TFIP.Business.Services
{
    using System;
    using System.IO;
    using System.Security.Cryptography;
    using System.Text;

    using TFIP.Business.Contracts;

    /// <summary>
    /// The file service.
    /// </summary>
    public class FileService : IFileService
    {
        #region Public Methods and Operators

        /// <summary>
        /// The to rooted path.
        /// </summary>
        /// <param name="path">
        /// The path.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string ToRootedPath(string path)
        {
            if (Path.IsPathRooted(path))
            {
                return path;
            }
            string baseDirectoryPath = AppDomain.CurrentDomain.BaseDirectory;
            return Path.Combine(baseDirectoryPath, path);
        }

        /// <summary>
        /// The check if file exist.
        /// </summary>
        /// <param name="filePath">
        /// The file path.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public bool CheckIfFileExist(string filePath)
        {
            return File.Exists(filePath);
        }

        /// <summary>
        /// The create.
        /// </summary>
        /// <param name="path">
        /// The path.
        /// </param>
        /// <returns>
        /// The <see cref="FileStream"/>.
        /// </returns>
        public FileStream Create(string path)
        {
            return File.Create(path);
        }

        /// <summary>
        /// The delete directory if exists.
        /// </summary>
        /// <param name="path">
        /// The path.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public bool DeleteDirectoryIfExists(string path)
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
                return true;
            }
            return false;
        }

        /// <summary>
        /// The get m d 5 hash.
        /// </summary>
        /// <param name="filename">
        /// The filename.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public string GetMD5Hash(string filename)
        {
            using (var md5 = new MD5CryptoServiceProvider())
            {
                byte[] buffer = md5.ComputeHash(File.ReadAllBytes(filename));
                var sb = new StringBuilder();
                foreach (byte b in buffer)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }

        /// <summary>
        /// The move.
        /// </summary>
        /// <param name="from">
        /// The from.
        /// </param>
        /// <param name="to">
        /// The to.
        /// </param>
        public void Move(string from, string to)
        {
            this.VarifyFilder(to);

            foreach (string sourceFileName in Directory.GetFiles(from))
            {
                this.MoveFileTo(sourceFileName, to);
            }
            this.DeleteDirectoryIfExists(from);
        }

        /// <summary>
        /// The move file to.
        /// </summary>
        /// <param name="sourceFileName">
        /// The source file name.
        /// </param>
        /// <param name="destinationFolder">
        /// The destination folder.
        /// </param>
        public void MoveFileTo(string sourceFileName, string destinationFolder)
        {
            var file = new FileInfo(sourceFileName);

            this.VarifyFilder(destinationFolder);
            string destination = Path.Combine(destinationFolder, file.Name);
            file.MoveTo(destination);
        }

        /// <summary>
        /// The read all bytes.
        /// </summary>
        /// <param name="filePath">
        /// The file path.
        /// </param>
        /// <returns>
        /// The <see cref="byte[]"/>.
        /// </returns>
        public byte[] ReadAllBytes(string filePath)
        {
            return File.ReadAllBytes(filePath);
        }

        /// <summary>
        /// The get file stream.
        /// </summary>
        /// <param name="filePath">
        /// The file path.
        /// </param>
        /// <returns>
        /// The <see cref="Stream"/>.
        /// </returns>
        public Stream GetFileStream(string filePath)
        {
            return File.OpenRead(filePath);
        }

        /// <summary>
        /// The read to end.
        /// </summary>
        /// <param name="filePath">
        /// The file path.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public string ReadToEnd(string filePath)
        {
            return File.ReadAllText(filePath);
        }

        /// <summary>
        /// The rename.
        /// </summary>
        /// <param name="sourceFileName">
        /// The source file name.
        /// </param>
        /// <param name="destFileName">
        /// The dest file name.
        /// </param>
        public void Rename(string sourceFileName, string destFileName)
        {
            File.Move(sourceFileName, destFileName);
        }

        #endregion

        #region Methods

        /// <summary>
        /// The varify filder.
        /// </summary>
        /// <param name="path">
        /// The path.
        /// </param>
        private void VarifyFilder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        #endregion
    }
}