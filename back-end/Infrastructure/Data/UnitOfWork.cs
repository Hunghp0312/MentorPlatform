using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Infrastructure.Repositories;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private bool _disposed = false;

        private ICategoryRepo _categoryRepo;
        private ICourseRepo _courseRepo;

        public UnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public ICategoryRepo Categories
        {
            get
            {
                return _categoryRepo ??= new CategoryRepo(_dbContext);
            }
        }

        public ICourseRepo Courses
        {
            get
            {
                return _courseRepo ??= new CourseRepo(_dbContext);
            }
        }

        public async Task<int> CommitAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    // Giải phóng các managed resources (DbContext)
                    _dbContext.Dispose();
                }
                // Giải phóng các unmanaged resources (nếu có)
                _disposed = true;
            }
        }

        // Destructor (nếu cần giải phóng unmanaged resources)
        // ~UnitOfWork()
        // {
        //     Dispose(false);
        // }
    }
}
