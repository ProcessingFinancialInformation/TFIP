using TFIP.Business.Contracts;
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
    }
}
