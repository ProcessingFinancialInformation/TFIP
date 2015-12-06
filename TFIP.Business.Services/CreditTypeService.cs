using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class CreditTypeService : ICreditTypeService
    {
        private readonly ICreditUow creditUow;

        public CreditTypeService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        public void CreateOrUpdateCreditType(CreditTypeViewModel creditTypeViewModel)
        {
            var entity = AutoMapper.Mapper.Map<CreditTypeViewModel, CreditType>(creditTypeViewModel);
            creditUow.CreditTypes.InsertOrUpdate(entity);
            creditUow.Commit();
            creditTypeViewModel.Id = entity.Id;
        }
    }
}
