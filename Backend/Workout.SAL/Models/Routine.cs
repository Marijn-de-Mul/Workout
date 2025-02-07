namespace Workout.SAL.Models;

public class Routine
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public User User { get; set; }
    public ICollection<RoutineCategory> RoutineCategories { get; set; } 
}