using System;
using TFIP.Business.Entities.NBRB;

namespace TFIP.Data.Contracts
{
    public interface INbrbUow : IDisposable
    {
        IBaseRepository<NbrbInfo> NbrbInfo { get; }
    }
}
