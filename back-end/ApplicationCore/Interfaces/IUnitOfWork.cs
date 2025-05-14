using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;

namespace ApplicationCore.Interfaces
{
    public interface IUnitOfWork : IDisposable // IDisposable để giải phóng DbContext nếu cần
    {
        // Tùy chọn: Bạn có thể expose các repository thông qua IUnitOfWork
        ICategoryRepo Categories { get; }
        // ICourseRepo Courses { get; }
        // Nếu không, các service sẽ inject trực tiếp các repository cần thiết.
        // Đối với ví dụ này, chúng ta tập trung vào việc commit.
        ICourseRepo Courses { get; }

        Task<int> CommitAsync(); // Hoặc SaveChangesAsync()
        Task BeginTransactionAsync();
        Task RollbackAsync();
        Task<int> SaveChangesAsync();
    }
}

