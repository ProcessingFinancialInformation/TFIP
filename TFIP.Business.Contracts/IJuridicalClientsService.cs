using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Models;

namespace TFIP.Business.Contracts
{
    public interface IJuridicalClientsService
    {
        bool IsClientExist(string individualNumber);

        void CreateClient(JuridicalClientViewModel client);
    }
}
