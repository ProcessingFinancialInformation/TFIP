using System.Data.Entity.ModelConfiguration;
using TFIP.Business.Entities.NBRB;

namespace TFIP.Data.NBRB.Configurations
{
    public class NbrbConfiguration : EntityTypeConfiguration<NbrbInfo>
    {
        public NbrbConfiguration()
        {
            this.ToTable("NBRB");
        }
    }
}
