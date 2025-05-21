using ApplicationCore.JsonConverters;
using ApplicationCore.Repositories;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.Validators.Categories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.BaseRepository;
using Infrastructure.Data;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;
using Presentation.Configurations;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        connectionString,
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
        }
    )
);
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseService, CourseService>();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(CategoryRequestDtoValidator).Assembly);
builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new TrimmingJsonStringConverter());
    });
builder.Services.ConfigureApiBehavior();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();
app.UseCors(option => option.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
