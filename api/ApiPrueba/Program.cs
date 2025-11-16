using ApiPrueba.Data;
using ApiPrueba.JWT;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ClinicaFisioterapiaBD>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("ClinicaFisioterapiaBD")));


builder.Services.AddScoped<JwtTokenGenerator>();


// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCors", policy => policy.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
    .WithOrigins(""));
});


builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options => options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<ClinicaFisioterapiaBD>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(permitir => permitir.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

//app.UseCors("PermitirTodo");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
