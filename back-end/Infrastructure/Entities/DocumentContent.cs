using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    public class DocumentContent
    {
        [Key, ForeignKey(nameof(SupportingDocument))]
        public Guid SupportingDocumentId { get; set; }
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
        public virtual SupportingDocument SupportingDocument { get; set; } = null!;
    }
}