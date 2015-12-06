using System.Collections.Generic;
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

        public void ChangeCreditTypeStatus(long id, bool isActive)
        {
            var creditType = creditUow.CreditTypes.GetById(id);
            creditType.IsActive = isActive;
            creditUow.CreditTypes.InsertOrUpdate(creditType);
            creditUow.Commit();
        }

        public IEnumerable<CreditTypeViewModel> GetCreditTypes(bool? isActive)
        {
            IEnumerable<CreditType> result = isActive.HasValue
                ? creditUow.CreditTypes.Get(it => it.IsActive == isActive.Value)
                : creditUow.CreditTypes.All();

            return AutoMapper.Mapper.Map<IEnumerable<CreditType>, IEnumerable<CreditTypeViewModel>>(result);
        }

        public CreditTypeViewModel GetCreditType(long id)
        {
            var creditType = creditUow.CreditTypes.GetById(id);
            return AutoMapper.Mapper.Map<CreditType, CreditTypeViewModel>(creditType);
        }
    }
}
