using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;
using Workout.SAL.Repositories.Interfaces;

namespace Workout.SAL.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository;

        public ExerciseService(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<IEnumerable<Exercise>> GetAllExercises(string userId)
        {
            return await _exerciseRepository.GetAllExercises(userId);
        }

        public async Task<Exercise> GetExerciseById(int id, string userId)
        {
            return await _exerciseRepository.GetExerciseById(id, userId);
        }

        public async Task CreateExercise(Exercise exercise, int categoryId)
        {
            await _exerciseRepository.CreateExercise(exercise, categoryId);
        }

        public async Task UpdateExercise(Exercise exercise, int categoryId)
        {
            await _exerciseRepository.UpdateExercise(exercise, categoryId);
        }

        public async Task DeleteExercise(int id, string userId)
        {
            await _exerciseRepository.DeleteExercise(id, userId);
        }
    }
}