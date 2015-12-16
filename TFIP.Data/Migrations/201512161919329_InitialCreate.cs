namespace TFIP.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AttachmentHeader",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Attachment",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AttachmentHeaderId = c.Long(nullable: false),
                        UniqueFolder = c.Guid(nullable: false),
                        CreatedBy = c.String(),
                        CreatedAt = c.DateTime(nullable: false),
                        FileName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AttachmentHeader", t => t.AttachmentHeaderId, cascadeDelete: true)
                .Index(t => t.AttachmentHeaderId);
            
            CreateTable(
                "dbo.CreditRequest",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AttachmentHeaderId = c.Long(),
                        JuridicalClientId = c.Long(),
                        IndividualClientId = c.Long(),
                        TotalAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreditTypeId = c.Long(nullable: false),
                        CreationDate = c.DateTime(nullable: false),
                        ApprovalDate = c.DateTime(),
                        NextPaymentDate = c.DateTime(),
                        CurrentBalance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CurrentBalanceOnPercents = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Status = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AttachmentHeader", t => t.AttachmentHeaderId)
                .ForeignKey("dbo.CreditType", t => t.CreditTypeId, cascadeDelete: true)
                .ForeignKey("dbo.IndividualClient", t => t.IndividualClientId)
                .ForeignKey("dbo.JuridicalClient", t => t.JuridicalClientId)
                .Index(t => t.AttachmentHeaderId)
                .Index(t => t.JuridicalClientId)
                .Index(t => t.IndividualClientId)
                .Index(t => t.CreditTypeId);
            
            CreateTable(
                "dbo.CreditType",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        IsIndividual = c.Boolean(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Conditions = c.String(),
                        CreditKind = c.Int(nullable: false),
                        Rate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Term = c.Int(nullable: false),
                        AmountFrom = c.Decimal(precision: 18, scale: 2),
                        AmountTo = c.Decimal(precision: 18, scale: 2),
                        Currency = c.Int(nullable: false),
                        IsGuarantorRequired = c.Boolean(nullable: false),
                        IsDocumentsRequired = c.Boolean(nullable: false),
                        RequiredDocuments = c.String(),
                        MoneyType = c.Int(nullable: false),
                        TermOfApplication = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        CalculationType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Guarantor",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        CreditRequestId = c.Long(nullable: false),
                        PassportNo = c.String(maxLength: 9),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Patronymic = c.String(),
                        Gender = c.Int(nullable: false),
                        Nationality = c.String(),
                        PlaceOfBirth = c.String(),
                        Authority = c.String(),
                        DateOfIssue = c.DateTime(nullable: false),
                        DateOfExpiry = c.DateTime(nullable: false),
                        DateOfBirth = c.DateTime(nullable: false),
                        IdentificationNo = c.String(maxLength: 20),
                        AttachmentHeaderId = c.Long(),
                        CountryId = c.Long(nullable: false),
                        RegistrationCity = c.String(),
                        RegistrationRegion = c.String(),
                        RegistrationStreet = c.String(),
                        HouseNo = c.String(),
                        FlatNo = c.String(),
                        RegistrationDate = c.DateTime(nullable: false),
                        ContactEmail = c.String(),
                        ContactPhone = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AttachmentHeader", t => t.AttachmentHeaderId)
                .ForeignKey("dbo.Country", t => t.CountryId, cascadeDelete: true)
                .ForeignKey("dbo.CreditRequest", t => t.CreditRequestId, cascadeDelete: true)
                .Index(t => t.CreditRequestId)
                .Index(t => t.AttachmentHeaderId)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Country",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.IndividualClient",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        PassportNo = c.String(maxLength: 9),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Patronymic = c.String(),
                        Gender = c.Int(nullable: false),
                        Nationality = c.String(),
                        PlaceOfBirth = c.String(),
                        Authority = c.String(),
                        DateOfIssue = c.DateTime(nullable: false),
                        DateOfExpiry = c.DateTime(nullable: false),
                        DateOfBirth = c.DateTime(nullable: false),
                        IdentificationNo = c.String(maxLength: 20),
                        AttachmentHeaderId = c.Long(),
                        CountryId = c.Long(nullable: false),
                        RegistrationCity = c.String(),
                        RegistrationRegion = c.String(),
                        RegistrationStreet = c.String(),
                        HouseNo = c.String(),
                        FlatNo = c.String(),
                        RegistrationDate = c.DateTime(nullable: false),
                        ContactEmail = c.String(),
                        ContactPhone = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AttachmentHeader", t => t.AttachmentHeaderId)
                .ForeignKey("dbo.Country", t => t.CountryId, cascadeDelete: true)
                .Index(t => t.AttachmentHeaderId)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.JuridicalClient",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        RepresenterFirstName = c.String(),
                        RepresenterLastName = c.String(),
                        RepresenterPatronymic = c.String(),
                        RepresenterPosition = c.String(),
                        PAN = c.String(maxLength: 20),
                        RegistrationNumber = c.String(maxLength: 20),
                        RegistrationOrganisation = c.String(),
                        CheckingAccount = c.Long(nullable: false),
                        BankName = c.String(),
                        BankCode = c.Byte(nullable: false),
                        Zip = c.String(),
                        ContactFirstName = c.String(),
                        ContactLastName = c.String(),
                        ContactPatronymic = c.String(),
                        ContactFax = c.String(),
                        IdentificationNo = c.String(maxLength: 20),
                        AttachmentHeaderId = c.Long(),
                        CountryId = c.Long(nullable: false),
                        RegistrationCity = c.String(),
                        RegistrationRegion = c.String(),
                        RegistrationStreet = c.String(),
                        HouseNo = c.String(),
                        FlatNo = c.String(),
                        RegistrationDate = c.DateTime(nullable: false),
                        ContactEmail = c.String(),
                        ContactPhone = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AttachmentHeader", t => t.AttachmentHeaderId)
                .ForeignKey("dbo.Country", t => t.CountryId, cascadeDelete: true)
                .Index(t => t.PAN, unique: true)
                .Index(t => t.RegistrationNumber, unique: true)
                .Index(t => t.AttachmentHeaderId)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Payment",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        MainDeptAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        ProcessedBy = c.String(),
                        ProcessedAt = c.DateTime(nullable: false),
                        CreditRequestId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CreditRequest", t => t.CreditRequestId, cascadeDelete: true)
                .Index(t => t.CreditRequestId);
            
            CreateTable(
                "dbo.Notification",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Body = c.String(),
                        Subject = c.String(),
                        Recepient = c.String(),
                        Sender = c.String(),
                        CreatedAt = c.DateTime(nullable: false),
                        EmailStatus = c.Int(nullable: false),
                        LastError = c.String(),
                        CopyTo = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Setting",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SettingName = c.Int(nullable: false),
                        SettingValue = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Payment", "CreditRequestId", "dbo.CreditRequest");
            DropForeignKey("dbo.CreditRequest", "JuridicalClientId", "dbo.JuridicalClient");
            DropForeignKey("dbo.JuridicalClient", "CountryId", "dbo.Country");
            DropForeignKey("dbo.JuridicalClient", "AttachmentHeaderId", "dbo.AttachmentHeader");
            DropForeignKey("dbo.CreditRequest", "IndividualClientId", "dbo.IndividualClient");
            DropForeignKey("dbo.IndividualClient", "CountryId", "dbo.Country");
            DropForeignKey("dbo.IndividualClient", "AttachmentHeaderId", "dbo.AttachmentHeader");
            DropForeignKey("dbo.Guarantor", "CreditRequestId", "dbo.CreditRequest");
            DropForeignKey("dbo.Guarantor", "CountryId", "dbo.Country");
            DropForeignKey("dbo.Guarantor", "AttachmentHeaderId", "dbo.AttachmentHeader");
            DropForeignKey("dbo.CreditRequest", "CreditTypeId", "dbo.CreditType");
            DropForeignKey("dbo.CreditRequest", "AttachmentHeaderId", "dbo.AttachmentHeader");
            DropForeignKey("dbo.Attachment", "AttachmentHeaderId", "dbo.AttachmentHeader");
            DropIndex("dbo.Payment", new[] { "CreditRequestId" });
            DropIndex("dbo.JuridicalClient", new[] { "CountryId" });
            DropIndex("dbo.JuridicalClient", new[] { "AttachmentHeaderId" });
            DropIndex("dbo.JuridicalClient", new[] { "RegistrationNumber" });
            DropIndex("dbo.JuridicalClient", new[] { "PAN" });
            DropIndex("dbo.IndividualClient", new[] { "CountryId" });
            DropIndex("dbo.IndividualClient", new[] { "AttachmentHeaderId" });
            DropIndex("dbo.Guarantor", new[] { "CountryId" });
            DropIndex("dbo.Guarantor", new[] { "AttachmentHeaderId" });
            DropIndex("dbo.Guarantor", new[] { "CreditRequestId" });
            DropIndex("dbo.CreditRequest", new[] { "CreditTypeId" });
            DropIndex("dbo.CreditRequest", new[] { "IndividualClientId" });
            DropIndex("dbo.CreditRequest", new[] { "JuridicalClientId" });
            DropIndex("dbo.CreditRequest", new[] { "AttachmentHeaderId" });
            DropIndex("dbo.Attachment", new[] { "AttachmentHeaderId" });
            DropTable("dbo.Setting");
            DropTable("dbo.Notification");
            DropTable("dbo.Payment");
            DropTable("dbo.JuridicalClient");
            DropTable("dbo.IndividualClient");
            DropTable("dbo.Country");
            DropTable("dbo.Guarantor");
            DropTable("dbo.CreditType");
            DropTable("dbo.CreditRequest");
            DropTable("dbo.Attachment");
            DropTable("dbo.AttachmentHeader");
        }
    }
}
