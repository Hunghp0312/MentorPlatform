using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction? _transaction;
        private ICategoryRepo? _categoryRepo;
        private ICourseRepo? _courseRepo;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public ICategoryRepo Categories
        {
            get
            {
                return _categoryRepo ??= new CategoryRepo(_context);
            }
        }

        public ICourseRepo Courses
        {
            get
            {
                return _courseRepo ??= new CourseRepo(_context);
            }
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task<int> CommitAsync()
        {
            if (_transaction != null)
                await _transaction.CommitAsync();
            return await _context.SaveChangesAsync();
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
                await _transaction.RollbackAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}