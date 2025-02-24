using Microsoft.EntityFrameworkCore;
using Workout.SAL.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext() { }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Routine> Routines { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<RoutineCategory> RoutineCategories { get; set; }
    public DbSet<ExerciseCategory> ExerciseCategories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseMySql("Server=localhost;Port=4306;Database=workout;User=workout;Password=workout;", ServerVersion.AutoDetect("Server=localhost;Port=4306;Database=workout;User=workout;Password=workout;"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoutineCategory>()
            .HasKey(rc => new { rc.RoutineId, rc.CategoryId });

        modelBuilder.Entity<ExerciseCategory>()
            .HasKey(ec => new { ec.ExerciseId, ec.CategoryId });

        modelBuilder.Entity<RoutineCategory>()
            .HasOne(rc => rc.Routine)
            .WithMany(r => r.RoutineCategories)
            .HasForeignKey(rc => rc.RoutineId);

        modelBuilder.Entity<RoutineCategory>()
            .HasOne(rc => rc.Category)
            .WithMany(c => c.RoutineCategories)
            .HasForeignKey(rc => rc.CategoryId);

        modelBuilder.Entity<ExerciseCategory>()
            .HasOne(ec => ec.Exercise)
            .WithMany(e => e.ExerciseCategories)
            .HasForeignKey(ec => ec.ExerciseId);

        modelBuilder.Entity<ExerciseCategory>()
            .HasOne(ec => ec.Category)
            .WithMany(c => c.ExerciseCategories)
            .HasForeignKey(ec => ec.CategoryId);
    }
}