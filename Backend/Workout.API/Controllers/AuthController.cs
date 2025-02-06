using Microsoft.AspNetCore.Mvc;
using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;

namespace Workout.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.Login(request.Email, request.Password);
        if (token == null)
        {
            return Unauthorized();
        }
        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest("Passwords do not match.");
        }

        var token = await _authService.Register(request.Username, request.Email, request.Password);
        if (token == null)
        {
            return BadRequest("Registration failed.");
        }
        return Ok(new { Token = token });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _authService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }
        return Ok(user);
    }
}