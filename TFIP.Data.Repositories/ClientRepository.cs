using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;

namespace TFIP.Data.Repositories
{
    public class ClientRepository<T>: BaseRepository<T>, IClientRepository<T> where T: Client
    {
        public ClientRepository(DbContext dbContext) : base(dbContext)
        {
        }

        public override T GetById(long id)
        {
            return DbSet
                .Include(c => c.CreditRequests
                    .Select(request => request.CreditType))
                .FirstOrDefault(c=> c.Id == id);
        }
    }
}
