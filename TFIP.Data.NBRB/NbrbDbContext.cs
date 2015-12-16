using System.Data.Entity;
using TFIP.Business.Entities.NBRB;
using TFIP.Common.Constants;
using TFIP.Data.NBRB.Configurations;

namespace TFIP.Data.NBRB
{
    public class NbrbDbContext : DbContext
    {
        static NbrbDbContext()
        {
            Database.SetInitializer<NbrbDbContext>(null);
        }

        public NbrbDbContext()
            : this(DataAccessLayerConstants.NBRBDatabaseConnectionStringName)
        {
        }

        public NbrbDbContext(string connectionStringName)
            : base(connectionStringName)
        { }

        public IDbSet<NbrbInfo> NbrbInfo { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new NbrbConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}
