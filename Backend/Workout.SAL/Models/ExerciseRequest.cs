namespace Workout.SAL.Models
{
    public class ExerciseRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int RoutineId { get; set; }
        public int CategoryId { get; set; }
    }
}