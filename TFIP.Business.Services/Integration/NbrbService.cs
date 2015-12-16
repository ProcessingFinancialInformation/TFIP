using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Integration
{
    public class NbrbService : INbrbService
    {
        private readonly INbrbUow nbrbUow;

        public NbrbService(INbrbUow nbrbUow)
        {
            this.nbrbUow = nbrbUow;
        }

        public bool IsInNbrbDb(string identificationNo)
        {
            var nbrbInfo = nbrbUow.NbrbInfo
                .Get(it => it.IdentificationNo == identificationNo)
                .FirstOrDefault();

            return nbrbInfo != null;
        }
    }
}
