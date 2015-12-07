using System.Collections.Generic;
using TFIP.Business.Models;

namespace TFIP.Web.ViewModels
{
    public class CreditTypePageViewModel
    {
        public IEnumerable<ListItem> CreditKinds { get; set; } 

        public IEnumerable<ListItem> Currencies { get; set; }
        
        public IEnumerable<ListItem> MoneyTypes { get; set; }

        public IEnumerable<ListItem> PaymentTypes { get; set; }
    }
}
