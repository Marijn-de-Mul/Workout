// using Microsoft.EntityFrameworkCore;
// using ML.DAL.Data;
// using ML.DAL.Interfaces;
// using ML.DAL.Repositories;
// using ML.SAL.Interfaces;
// using ML.SAL.Models;
// using ML.SAL.Services;
// using DotNetEnv;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Env.Load(); 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<IMovieListService, MovieListService>();
// builder.Services.AddScoped<IMovieService, MovieService>();
//
// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<IMovieRepository, MovieRepository>();
// builder.Services.AddScoped<IMovieListRepository, MovieListRepository>();
//
// builder.Services.AddScoped<IUser, User>(); 
// builder.Services.AddScoped<IMovie, Movie>();
// builder.Services.AddScoped<IMovieList, MovieList>();
//
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseNpgsql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Workout API", Version = "v1" });

    c.CustomSchemaIds(type => type.FullName);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowSpecificOrigin");
app.MapControllers();

app.Run();