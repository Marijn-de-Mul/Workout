using Microsoft.EntityFrameworkCore;
using Workout.DAL;
using Workout.DAL.Repositories;
using Workout.DAL.Repositories.Interfaces;
using Workout.SAL.Helpers;
using Workout.SAL.Services;
using Workout.SAL.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("SecretKey");

builder.Services.AddScoped<IRoutineService, RoutineService>();
builder.Services.AddScoped<IExerciseService, ExerciseService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthService, AuthService>(provider =>
{
    var authRepository = provider.GetRequiredService<IAuthRepository>();
    var logger = provider.GetRequiredService<ILogger<AuthService>>();
    return new AuthService(authRepository, secretKey, logger);
});

builder.Services.AddSingleton<EncryptionHelper>();
builder.Services.AddSingleton<TokenHelper>(provider => new TokenHelper(secretKey));

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IRoutineRepository, RoutineRepository>();
builder.Services.AddScoped<IExerciseRepository, ExerciseRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

var app = builder.Build();

ApplyMigrations(app);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseMiddleware<TokenValidationMiddleware>(); 

app.UseAuthorization();

app.MapControllers();

app.Run();

void ApplyMigrations(IHost app)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}