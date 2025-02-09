using Workout.SAL.Models;

namespace Workout.SAL.Repositories.Interfaces
{
    public interface IRoutineRepository
    {
        Task<IEnumerable<Routine>> GetAllRoutines(string userId);
        Task<Routine> GetRoutineById(int id, string userId);
        Task CreateRoutine(Routine routine, int categoryId);
        Task UpdateRoutine(Routine routine, int categoryId);
        Task DeleteRoutine(int id, string userId);
    }
}