using System.Data.Entity;
using TFIP.Business.Entities.MIA;
using TFIP.Common.Constants;
using TFIP.Data.MIA.Configurations;

namespace TFIP.Data.MIA
{
    public class MiaDbContext : DbContext
    {
        static MiaDbContext()
        {
            Database.SetInitializer<MiaDbContext>(null);
        }

        public MiaDbContext()
            : this(DataAccessLayerConstants.MIADatabaseConnectionStringName)
        {
        }

        public MiaDbContext(string connectionStringName)
            : base(connectionStringName)
        {
        }

        public IDbSet<MiaInfo> MiaInfo { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new MiaConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}
