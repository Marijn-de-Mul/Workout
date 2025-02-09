using Workout.SAL.Models;

namespace Workout.SAL.Repositories.Interfaces
{
    public interface IExerciseRepository
    {
        Task<IEnumerable<Exercise>> GetAllExercises(string userId);
        Task<Exercise> GetExerciseById(int id, string userId);
        Task CreateExercise(Exercise exercise, int categoryId);
        Task UpdateExercise(Exercise exercise, int categoryId);
        Task DeleteExercise(int id, string userId);
    }
}