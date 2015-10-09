using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using TFIP.Business.Entities;
using TFIP.Common.Constants;

namespace TFIP.Data
{
    public class CreditDbContext : DbContext
    {
        #region Constructors
        static CreditDbContext()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<CreditDbContext, Migrations.Configuration>());
        }

        public CreditDbContext()
            : this(DataAccessLayerConstants.CreditDatabaseConnectionStringName)
        {
        }

        public CreditDbContext(string connectionStringName)
            : base(connectionStringName)
        {
        }
        #endregion

        #region DbSets
        public IDbSet<Attachment> Attachments { get; set; }

        public IDbSet<AttachmentHeader> AttachmentHeaders { get; set; }

        public IDbSet<CreditRequest> CreditRequests { get; set; }

        public IDbSet<CreditType> CreditTypes { get; set; }

        public IDbSet<Guarantor> Guarantors { get; set; }

        public IDbSet<IndividualClient> IndividualClients { get; set; }

        public IDbSet<JuridicalClient> JuridicalClients { get; set; }

        public IDbSet<Notification> Notifications { get; set; }

        public IDbSet<Payment> Payments { get; set; }

        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
