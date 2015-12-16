namespace TFIP.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CHangeBankCodeType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.JuridicalClient", "BankCode", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.JuridicalClient", "BankCode", c => c.Byte(nullable: false));
        }
    }
}
