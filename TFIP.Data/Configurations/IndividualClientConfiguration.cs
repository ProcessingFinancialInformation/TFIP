using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using TFIP.Business.Entities;

namespace TFIP.Data.Configurations
{
    public class IndividualClientConfiguration: EntityTypeConfiguration<IndividualClient>
    {
        public IndividualClientConfiguration()
        {
             Property(t => t.IdentificationNo).
                 HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new IndexAttribute()));
        }
    }
}
