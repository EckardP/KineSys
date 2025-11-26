using ApiPrueba.Data;
using ApiPrueba.JWT;
using ApiPrueba.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using ApiPrueba.Hub;

var builder = WebApplication.CreateBuilder(args);

// =======================
// DATABASE
// =======================
builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD")));

builder.Services.AddScoped<JwtTokenGenerator>();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCors", policy => policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials() 
        .WithOrigins("http://localhost:5173")
    );
});


// =======================
// JWT
// =======================
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = "ApiClinicaFisioterapia",
            ValidAudience = "ApiClinicaFisioterapiaUsers",

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])),

            // 🔥 IMPORTANTE: PARA QUE TU FILTRO RECONOZCA ROLES
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
// =======================
// APP
// =======================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar política correcta
app.UseCors("PoliticaCors");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<NotificacionesHub>("/Hub/NotificacionesHub");

app.MapControllers();

app.Run();







//using ApiPrueba.Data;
//using ApiPrueba.JWT;
//using ApiPrueba.Services;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);


//builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
//    opciones.UseSqlServer(builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD")));


//builder.Services.AddScoped<JwtTokenGenerator>();


//// Configurar CORS
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("PoliticaCors", policy => policy.AllowAnyHeader()
//    .AllowAnyMethod()
//    .AllowAnyOrigin()
//    .WithOrigins(" http://localhost:5173/"));
//});


//builder.Services.AddAuthentication("Bearer")
//    .AddJwtBearer("Bearer", options => options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(
//            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
//    });

//builder.Services.AddAuthorization();
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//// Registrar el servicio de autorización
//builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

//builder.Services.AddScoped<ClinicaFisioterapiaBD>();

//var app = builder.Build();


//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseCors(permitir => permitir.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

////app.UseCors("PermitirTodo");

//app.UseAuthentication();
//app.UseAuthorization();


//app.MapControllers();

//app.Run();
