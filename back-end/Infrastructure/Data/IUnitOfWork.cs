namespace Infrastructure.Data
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> CommitAsync();
        Task BeginTransactionAsync();
        Task RollbackAsync();
        Task<int> SaveChangesAsync();
    }
}
