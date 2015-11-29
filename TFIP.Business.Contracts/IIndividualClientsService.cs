using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Configuration;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IIndividualClientsService
    {
        bool IsClientExist(string IndividualNumber);

        void CreateClient(IndividualClientModel client);
    }
}
