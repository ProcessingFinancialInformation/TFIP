using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;

namespace TFIP.Data.Configurations
{
    public class JuridicalClientConfiguration : EntityTypeConfiguration<JuridicalClient>
    {
        public JuridicalClientConfiguration()
        {
            HasKey(x => new { x.Id, x.IdentificationNo });
        }
    }
}
