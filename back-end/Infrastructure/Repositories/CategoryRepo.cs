using ApplicationCore.Entity;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;

namespace Infrastructure.Repositories
{
    public class CategoryRepo : BaseRepo<Category>, ICategoryRepo
    {
        public CategoryRepo(AppDbContext context) : base(context)
        {
        }
    }
}