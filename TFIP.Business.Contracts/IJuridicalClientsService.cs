using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFIP.Business.Contracts
{
    public interface IJuridicalClientsService
    {
        bool IsClientExist(string IndividualNumber);
    }
}
