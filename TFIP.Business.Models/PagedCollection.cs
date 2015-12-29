using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Models
{
    public class PagedCollection<T>
    {
        public List<T> Collection { get; set; }

        public int TotalItems { get; set; }
    }
}
