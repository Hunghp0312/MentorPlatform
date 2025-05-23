﻿namespace Infrastructure.Entities
{
    public class DocumentContent
    {
        public Guid Id { get; set; }
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public virtual SupportingDocument? SupportingDocument { get; set; }
        public virtual Resource? Resource { get; set; }
    }
}