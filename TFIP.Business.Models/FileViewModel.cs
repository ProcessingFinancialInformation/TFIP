using System.IO;

namespace TFIP.Business.Models
{
    public class FileViewModel
    {
        public Stream InputStream { get; set; }

        public string FileName { get; set; }
    }
}
