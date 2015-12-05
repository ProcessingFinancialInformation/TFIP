using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class JuridicalClientsService: IJuridicalClientsService
    {
        private readonly ICreditUow creditUow;

        public JuridicalClientsService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        bool IJuridicalClientsService.IsClientExist(string individualNumber)
        {
            return
                creditUow.JuridicalClients.Get(client => client.IdentificationNo.Equals(individualNumber))
                    .FirstOrDefault() != null;
        }
    }
}
