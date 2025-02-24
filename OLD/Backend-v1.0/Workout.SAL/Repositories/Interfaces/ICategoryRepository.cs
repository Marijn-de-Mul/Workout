using Workout.SAL.Models;

namespace Workout.DAL.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesByUserId(string userId);
        Task<Category> GetCategoryById(int id, string userId);
        Task CreateCategory(Category category);
        Task UpdateCategory(Category category);
        Task DeleteCategory(int id, string userId);
    }
}