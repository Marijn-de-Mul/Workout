using Workout.SAL.Models;
using Workout.SAL.Services.Interfaces;
using Workout.DAL.Repositories.Interfaces;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Category>> GetAllCategories(string userId)
    {
        return await _categoryRepository.GetAllCategoriesByUserId(userId);
    }

    public async Task<Category> GetCategoryById(int id, string userId)
    {
        return await _categoryRepository.GetCategoryById(id, userId);
    }

    public async Task CreateCategory(Category category)
    {
        await _categoryRepository.CreateCategory(category);
    }

    public async Task UpdateCategory(Category category)
    {
        await _categoryRepository.UpdateCategory(category);
    }

    public async Task DeleteCategory(int id, string userId)
    {
        await _categoryRepository.DeleteCategory(id, userId);
    }
}