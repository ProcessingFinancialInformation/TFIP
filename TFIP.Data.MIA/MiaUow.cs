using System;
using TFIP.Business.Entities.MIA;
using TFIP.Data.Contracts;
using TFIP.Data.Repositories;

namespace TFIP.Data.MIA
{
    public class MiaUow : IMiaUow
    {
        private readonly MiaDbContext dbContext;

        public MiaUow(MiaDbContext dbContext)
        {
            this.dbContext = dbContext;
            ConfigureDbContext();
        }

        private IBaseRepository<MiaInfo> _miaInfo;

        public IBaseRepository<MiaInfo> MiaInfo
        {
            get
            {
                return _miaInfo ?? (_miaInfo = new BaseRepository<MiaInfo>(dbContext));
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (dbContext != null)
                {
                    dbContext.Dispose();
                }
            }
        }

        protected void ConfigureDbContext()
        {
            dbContext.Configuration.ProxyCreationEnabled = false;
            dbContext.Configuration.LazyLoadingEnabled = false;
        }
    }
}
