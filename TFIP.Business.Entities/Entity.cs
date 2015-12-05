using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace TFIP.Business.Entities
{
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// Base class for all database entities.
    /// </summary>
    public class Entity : IEntity
    {
        /// <summary>
        /// Primary key.
        /// </summary>
        [XmlIgnore]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public bool IsNew()
        {
            return Id == 0;
        }
    }
}
