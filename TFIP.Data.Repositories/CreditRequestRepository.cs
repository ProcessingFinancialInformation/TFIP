using System.Data.Entity;
using System.Linq;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;

namespace TFIP.Data.Repositories
{
    public class CreditRequestRepository : BaseRepository<CreditRequest>, ICreditRequestRepository
    {
        public CreditRequestRepository(DbContext dbContext) : base(dbContext)
        {
        }

        public CreditRequest GetFullCreditRequest(long id)
        {
            return All()
                .Include(it => it.CreditType)
                .Include(it => it.IndividualClient)
                .Include(it => it.JuridicalClient)
                .Include(it => it.AttachmentHeader)
                .Include(it => it.AttachmentHeader.Attachments)
                .Include(it => it.Payments)
                .FirstOrDefault(it => it.Id == id);
        }
    }
}
