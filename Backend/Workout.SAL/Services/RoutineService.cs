using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;
using Workout.SAL.Repositories.Interfaces;

namespace Workout.SAL.Services
{
    public class RoutineService : IRoutineService
    {
        private readonly IRoutineRepository _routineRepository;

        public RoutineService(IRoutineRepository routineRepository)
        {
            _routineRepository = routineRepository;
        }

        public async Task<IEnumerable<Routine>> GetAllRoutines(string userId)
        {
            return await _routineRepository.GetAllRoutines(userId);
        }

        public async Task<Routine> GetRoutineById(int id, string userId)
        {
            return await _routineRepository.GetRoutineById(id, userId);
        }

        public async Task CreateRoutine(Routine routine, int categoryId)
        {
            await _routineRepository.CreateRoutine(routine, categoryId);
        }

        public async Task UpdateRoutine(Routine routine, int categoryId)
        {
            await _routineRepository.UpdateRoutine(routine, categoryId);
        }

        public async Task DeleteRoutine(int id, string userId)
        {
            await _routineRepository.DeleteRoutine(id, userId);
        }
    }
}