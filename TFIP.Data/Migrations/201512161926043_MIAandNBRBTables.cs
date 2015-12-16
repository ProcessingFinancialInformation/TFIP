namespace TFIP.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MIAandNBRBTables : DbMigration
    {
        public override void Up()
        {
            Sql(@"CREATE TABLE [dbo].[MIA](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[IdentificationNo] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]");

            Sql(@"CREATE TABLE [dbo].[NBRB](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[IdentificationNo] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]");
        }
        
        public override void Down()
        {
            Sql(@"DROP TABLE [dbo].[NBRB]");
            Sql(@"DROP TABLE [dbo].[MIA]");
        }
    }
}
