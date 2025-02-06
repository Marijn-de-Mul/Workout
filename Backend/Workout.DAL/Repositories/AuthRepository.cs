using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Workout.DAL.Repositories.Interfaces;
using Workout.SAL.Models;

namespace Workout.DAL.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private const string FilePath = "users.json";
        private List<User> _users;

        public AuthRepository()
        {
            if (File.Exists(FilePath))
            {
                var jsonData = File.ReadAllText(FilePath);
                if (string.IsNullOrWhiteSpace(jsonData))
                {
                    _users = new List<User>();
                }
                else
                {
                    _users = JsonSerializer.Deserialize<List<User>>(jsonData) ?? new List<User>();
                }
            }
            else
            {
                _users = new List<User>();
            }
        }

        public Task<User> GetUserByEmail(string email)
        {
            var user = _users.FirstOrDefault(u => u.Email == email);
            return Task.FromResult(user);
        }
        
        public async Task<User> GetUserById(string userId)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.Id == userId));
        }

        public Task<User> CreateUser(User user)
        {
            user.Id = (_users.Count + 1).ToString();
            _users.Add(user);
            SaveChanges();
            return Task.FromResult(user);
        }

        private void SaveChanges()
        {
            var jsonData = JsonSerializer.Serialize(_users);
            File.WriteAllText(FilePath, jsonData);
        }
    }
}