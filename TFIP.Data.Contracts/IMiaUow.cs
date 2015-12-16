using System;
using TFIP.Business.Entities.MIA;

namespace TFIP.Data.Contracts
{
    public interface IMiaUow : IDisposable
    {
        IBaseRepository<MiaInfo> MiaInfo { get; }
    }
}
