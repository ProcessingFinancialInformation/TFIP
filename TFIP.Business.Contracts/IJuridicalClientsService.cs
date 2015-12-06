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
        long IsClientExist(string identificationNo);

        void CreateClient(CreateJuridicalClientViewModel client);

        JuridicalClientInfoViewModel GetJuridicalClient(long id);
    }
}
