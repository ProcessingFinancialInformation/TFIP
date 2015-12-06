using System.Data.Entity.ModelConfiguration;
using TFIP.Business.Entities;

namespace TFIP.Data.Configurations
{
    public class GuarantorConfiguration : EntityTypeConfiguration<Guarantor>
    {
        public GuarantorConfiguration()
        {
            this.HasRequired(it => it.CreditRequest)
                .WithMany(it => it.Guarantors)
                .HasForeignKey(it => it.CreditRequestId);

            this.Ignore(it => it.CreditRequests);
        }
    }
}
