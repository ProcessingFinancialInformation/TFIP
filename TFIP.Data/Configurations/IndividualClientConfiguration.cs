using System.Data.Entity.ModelConfiguration;
using TFIP.Business.Entities;

namespace TFIP.Data.Configurations
{
    public class IndividualClientConfiguration: EntityTypeConfiguration<IndividualClient>
    {
        public IndividualClientConfiguration()
        {
            this.HasMany(it => it.CreditRequests)
                .WithOptional(it => it.IndividualClient)
                .HasForeignKey(it => it.IndividualClientId);
        }
    }
}
