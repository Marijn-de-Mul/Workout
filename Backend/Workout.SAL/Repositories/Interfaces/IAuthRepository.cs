using Workout.SAL.Models;

namespace Workout.DAL.Repositories.Interfaces;

public interface IAuthRepository
{
    Task<User> GetUserByEmail(string email);
    Task<User> CreateUser(User user);
    Task<User> GetUserById(string userId);
}