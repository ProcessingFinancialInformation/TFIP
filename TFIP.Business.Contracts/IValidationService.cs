using System.Collections.Generic;

namespace TFIP.Business.Contracts
{
    public interface IValidationService<T>
    {
        IEnumerable<string> Validate(T viewModel);
    }
}
