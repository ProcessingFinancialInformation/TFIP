using System.Collections.Generic;
using System.Linq;

namespace TFIP.Web.Api.Models
{
    public class AjaxViewModel
    {
        public object Data { get; set; }

        public IList<string> Errors { get; set; }

        public bool IsValid
        {
            get { return Errors.Any(); }
        }

        public AjaxViewModel()
        {
            Errors = new List<string>();
        }
    }
}