using ServidorDotNet.Controllers;
using ServidorDotNet.Repositorios;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = "Server=localhost;Database=tienda_angular_dotnet_lunargames;User=root;Password=";

// Register repositories
builder.Services.AddScoped<ICarritoRepositorio>(provider => new CarritoRepositorio(connectionString));
builder.Services.AddScoped<IPedidoRepositorio>(provider => 
    new PedidoRepositorio(connectionString, provider.GetRequiredService<ICarritoRepositorio>()));

// Register controllers with connection string
builder.Services.AddScoped(provider => new VideojuegosController(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Lo siguiente es necesario para usar la sesion en .net core
builder.Services.AddDataProtection();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Important: UseCors must be called before UseAuthorization and UseEndpoints
app.UseCors();
app.UseAuthorization();
app.UseSession();//Obligatorio para poder utilizar Session
app.UseStaticFiles();
app.MapControllers();

app.Run();
