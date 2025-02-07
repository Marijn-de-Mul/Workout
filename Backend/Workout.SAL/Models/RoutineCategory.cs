namespace Workout.SAL.Models;

public class RoutineCategory
{
    public int RoutineId { get; set; }
    public int CategoryId { get; set; }
    public Routine Routine { get; set; }
    public Category Category { get; set; }
}