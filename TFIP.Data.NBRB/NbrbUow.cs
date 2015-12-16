using System;
using TFIP.Business.Entities.NBRB;
using TFIP.Data.Contracts;
using TFIP.Data.Repositories;

namespace TFIP.Data.NBRB
{
    public class NbrbUow : INbrbUow
    {
        private readonly NbrbDbContext dbContext;

        public NbrbUow(NbrbDbContext dbContext)
        {
            this.dbContext = dbContext;
            ConfigureDbContext();
        }

        private IBaseRepository<NbrbInfo> _nbrbInfo;

        public IBaseRepository<NbrbInfo> NbrbInfo
        {
            get
            {
                return _nbrbInfo ?? (_nbrbInfo = new BaseRepository<NbrbInfo>(dbContext));
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
