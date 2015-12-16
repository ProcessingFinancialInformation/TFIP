using System.Data.Entity.ModelConfiguration;
using TFIP.Business.Entities.MIA;

namespace TFIP.Data.MIA.Configurations
{
    public class MiaConfiguration : EntityTypeConfiguration<MiaInfo>
    {
        public MiaConfiguration()
        {
            this.ToTable("MIA");
        }
    }
}
