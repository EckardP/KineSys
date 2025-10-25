using ApiPrueba.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1 Configuración de conexión SQL Server
builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD")));

// 2 Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy.AllowAnyOrigin()      // Permite cualquier origen (frontend)
              .AllowAnyMethod()      // Permite GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader();     // Permite cualquier encabezado
    });
});

// 3 Controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4 Inyección de dependencias (si las usas más adelante)
builder.Services.AddScoped<ClinicaFisioterapiaBD>();

var app = builder.Build();

// 5 Configuración del entorno
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 6 Activar la política CORS (antes de Authorization)
app.UseCors("PermitirTodo");

app.UseAuthorization();

// 7 Mapear controladores
app.MapControllers();

app.Run();
