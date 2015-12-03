using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
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
            Property(t => t.IdentificationNo).
                 HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new IndexAttribute()));
        }
    }
}
