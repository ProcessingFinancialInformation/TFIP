using System.Data.Entity.Migrations;

namespace TFIP.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<CreditDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(CreditDbContext context)
        {

        }
    }
}
