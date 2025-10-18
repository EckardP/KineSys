using ApiPrueba.data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Configurar cadena de conexión desde appsettings.json
var cadenaConexion = builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD");

// 2️⃣ Registrar el contexto de base de datos
builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
    opciones.UseSqlServer(cadenaConexion));

// 3️⃣ Configurar CORS (permite que React acceda a la API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaReact", policy =>
        policy.WithOrigins("http://localhost:5173") // 👈 el puerto donde corre tu React
              .AllowAnyHeader()
              .AllowAnyMethod());
});


// 4️⃣ Agregar controladores, Swagger y dependencias
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ClinicaFisioterapiaBD>();

var app = builder.Build();

// 5️⃣ Aplicar migraciones automáticamente al iniciar (solo en desarrollo o Docker)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ClinicaFisioterapiaBD>();
    db.Database.Migrate();
}

// 6️⃣ Configurar el entorno (Swagger)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7️⃣ Configurar el pipeline HTTP
app.UseHttpsRedirection();
app.UseAuthorization();

// 8️⃣ Activar CORS con la política definida arriba
app.UseCors("PoliticaReact");

// 9️⃣ Mapear controladores
app.MapControllers();

// 10️⃣ Ejecutar la aplicación
app.Run();
