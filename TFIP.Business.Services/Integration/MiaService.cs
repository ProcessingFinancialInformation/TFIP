using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Integration
{
    public class MiaService : IMiaService
    {
        private readonly IMiaUow miaUow;

        public MiaService(IMiaUow miaUow)
        {
            this.miaUow = miaUow;
        }

        public bool IsInMiaDb(string identificationNo)
        {
            var miaInfo = miaUow.MiaInfo
                .Get(it => it.IdentificationNo == identificationNo)
                .FirstOrDefault();

            return miaInfo != null;
        }
    }
}
