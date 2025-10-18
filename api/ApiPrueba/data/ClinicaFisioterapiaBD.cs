using ApiPrueba.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace ApiPrueba.data
{
    public class ClinicaFisioterapiaBD : DbContext
    {
        public ClinicaFisioterapiaBD(DbContextOptions<ClinicaFisioterapiaBD> opciones) : base(opciones) { }

        // Tablas principales
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Terapeuta> Terapeutas { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Tratamiento> Tratamientos { get; set; }
        public DbSet<PlanTratamiento> PlanesTratamiento { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<SeguroMedico> SegurosMedicos { get; set; }
        public DbSet<Equipo> Equipos { get; set; }
        public DbSet<Inventario> Inventarios { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<MensajeChat> MensajesChat { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelo)
        {
            base.OnModelCreating(modelo);

            // Relaciones y restricciones básicas
            modelo.Entity<Cita>()
                .HasOne(c => c.Paciente)
                .WithMany(p => p.Citas)
                .HasForeignKey(c => c.IdPaciente);

            modelo.Entity<Cita>()
                .HasOne(c => c.Terapeuta)
                .WithMany(t => t.Citas)
                .HasForeignKey(c => c.IdTerapeuta);

            modelo.Entity<Tratamiento>()
                .HasOne(t => t.Paciente)
                .WithMany(p => p.Tratamientos)
                .HasForeignKey(t => t.IdPaciente);

            modelo.Entity<Tratamiento>()
                .HasOne(t => t.Terapeuta)
                .WithMany(ter => ter.Tratamientos)
                .HasForeignKey(t => t.IdTerapeuta);

            modelo.Entity<Equipo>()
                .HasOne(e => e.Inventario)
                .WithOne(i => i.Equipo)
                .HasForeignKey<Inventario>(i => i.IdEquipo);

            // Relación uno a uno entre Tratamiento y PlanTratamiento
            modelo.Entity<Tratamiento>()
                .HasOne(t => t.PlanTratamiento)
                .WithOne(p => p.Tratamiento)
                .HasForeignKey<PlanTratamiento>(p => p.IdTratamiento);

            // Configurar precisión del campo MontoTotal en Factura
            modelo.Entity<Factura>()
                .Property(f => f.MontoTotal)
                .HasPrecision(18, 2);

            // Solución error de cascada múltiple
            modelo.Entity<Factura>()
                .HasOne(f => f.SeguroMedico)
                .WithMany()
                .HasForeignKey(f => f.IdSeguroMedico)
                .OnDelete(DeleteBehavior.Restrict); // Evita el ciclo

            modelo.Entity<Cita>()
                .HasOne(c => c.Tratamiento)
                .WithMany()
                .HasForeignKey(c => c.IdTratamiento)
                .OnDelete(DeleteBehavior.Restrict);

            modelo.Entity<Tratamiento>()
                .HasOne(t => t.PlanTratamiento)
                .WithOne(p => p.Tratamiento)
                .HasForeignKey<PlanTratamiento>(p => p.IdTratamiento)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
