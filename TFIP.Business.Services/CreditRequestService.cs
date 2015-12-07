using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class CreditRequestService : ICreditRequestService
    {
        private readonly ICreditUow creditUow;

        public CreditRequestService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public CreditRequestViewModel GetCreditRequestInfo(long id)
        {
            var creditRequest = creditUow.CreditRequests.GetFullCreditRequest(id);
            return AutoMapper.Mapper.Map<CreditRequest, CreditRequestViewModel>(creditRequest);
        }
    }
}
