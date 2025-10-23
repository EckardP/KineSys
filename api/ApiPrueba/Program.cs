using ApiPrueba.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Configuración de conexión SQL Server
builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD")));

// Habilitar controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Inyección de dependencias (los servicios se añadirán luego)
builder.Services.AddScoped<ClinicaFisioterapiaBD>();



var app = builder.Build();

// Configuración de entorno
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();


//using ApiPrueba.data;
//using Microsoft.EntityFrameworkCore;

//var builder = WebApplication.CreateBuilder(args);
//var CadenaConexion=builder.Configuration.GetConnectionString("CadenaConexionDB");
//builder.Services.AddDbContext<ConexionContextDB>(options=>options.UseSqlServer(CadenaConexion));
//// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();
