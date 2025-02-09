using Workout.SAL.Models;

namespace Workout.SAL.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategories(string userId);
        Task<Category> GetCategoryById(int id, string userId);
        Task CreateCategory(Category category);
        Task UpdateCategory(Category category);
        Task DeleteCategory(int id, string userId);
    }
}