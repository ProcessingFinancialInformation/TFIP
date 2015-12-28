using System;
using System.Collections.Generic;
using TFIP.Business.Entities;

namespace TFIP.Business.Contracts
{
    public interface IMapperProfileService
    {
        DateTime? GetLastPaymentDate(IEnumerable<Payment> payments);
    }
}
