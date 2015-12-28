using System;
using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services.Mapper
{
    public class MapperProfileService : IMapperProfileService
    {
        private readonly ICreditUow creditUow;

        public MapperProfileService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public DateTime? GetLastPaymentDate(IEnumerable<Payment> payments)
        {
            var lastPayment = payments
                .OrderByDescending(it => it.ProcessedAt)
                .FirstOrDefault();

            if (lastPayment != null)
            {
                return lastPayment.ProcessedAt;
            }

            return null;
        }
    }
}
