using Microsoft.EntityFrameworkCore;
using ApiPrueba.Models;

namespace ApiPrueba.Data
{
    /// <summary>
    /// Contexto principal de la base de datos para la clínica de fisioterapia.
    /// Contiene todos los DbSet y configuraciones mínimas necesarias.
    /// Las relaciones se infieren automáticamente desde las propiedades de navegación en los modelos.
    /// </summary>
    public class ClinicaFisioterapiaBD : DbContext
    {
        public ClinicaFisioterapiaBD(DbContextOptions<ClinicaFisioterapiaBD> options)
            : base(options)
        {
        }

        // =======================
        // ENTIDADES PRINCIPALES
        // =======================
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Terapeuta> Terapeutas { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Equipo> Equipos { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<TipoTerapia> TipoTerapias { get; set; }
        public DbSet<SeguroMedico> SegurosMedicos { get; set; }

        // =======================
        // GESTIÓN DE PACIENTES
        // =======================
        public DbSet<ContactoEmergencia> ContactosEmergencia { get; set; }
        public DbSet<DocumentoPaciente> DocumentosPaciente { get; set; }
        public DbSet<EvolucionPaciente> EvolucionesPaciente { get; set; }

        // =======================
        // GESTIÓN DE TERAPEUTAS
        // =======================
        public DbSet<DisponibilidadTerapeuta> DisponibilidadesTerapeutas { get; set; }

        // =======================
        // TRATAMIENTOS Y TERAPIAS
        // =======================
        public DbSet<Tratamiento> Tratamientos { get; set; }
        public DbSet<PlanTratamiento> PlanTratamientos { get; set; }
        public DbSet<ProtocoloTratamiento> ProtocoloTratamientos { get; set; }

        // =======================
        // AGENDA Y CITAS
        // =======================
        public DbSet<ReservaCita> ReservasCita { get; set; }
        public DbSet<AlertaAgenda> AlertasAgenda { get; set; }
        public DbSet<NotaSesion> NotasSesion { get; set; }

        // =======================
        // TABLAS INTERMEDIAS (N:N)
        // =======================
        public DbSet<EquipoSesion> EquiposSesion { get; set; }
        public DbSet<TerapeutaEspecialidad> TerapeutaEspecialidades { get; set; }
        public DbSet<TratamientoProtocolo> TratamientoProtocolos { get; set; }
        public DbSet<TratamientoTipoTerapia> TratamientoTipoTerapias { get; set; }
        public DbSet<ProtocoloTipoTerapia> ProtocoloTipoTerapias { get; set; }

        // =======================
        // CONFIGURACIÓN DE MODELOS
        // =======================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cita>(entity =>
            {
                entity.HasOne(c => c.Paciente)
                    .WithMany()
                    .HasForeignKey(c => c.IdPaciente)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Terapeuta)
                    .WithMany()
                    .HasForeignKey(c => c.IdTerapeuta)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Tratamiento)
                    .WithMany()
                    .HasForeignKey(c => c.IdTratamiento)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========================================
            // CONFIGURACIÓN DE HERENCIA TPH (Table Per Hierarchy)
            // Persona es abstracta, Paciente y Terapeuta heredan
            // ========================================
            modelBuilder.Entity<Persona>()
                .HasDiscriminator<string>("TipoPersona")
                .HasValue<Paciente>("Paciente")
                .HasValue<Terapeuta>("Terapeuta");

            // ========================================
            // ÍNDICES ÚNICOS PARA TABLAS INTERMEDIAS
            // Previenen duplicados en relaciones N:N
            // ========================================

            modelBuilder.Entity<TerapeutaEspecialidad>()
                .HasIndex(te => new { te.IdTerapeuta, te.IdEspecialidad })
                .IsUnique();

            modelBuilder.Entity<TratamientoProtocolo>()
                .HasIndex(tp => new { tp.IdTratamiento, tp.IdProtocolo })
                .IsUnique();

            modelBuilder.Entity<TratamientoTipoTerapia>()
                .HasIndex(tt => new { tt.IdTratamiento, tt.IdTipoTerapia })
                .IsUnique();

            modelBuilder.Entity<ProtocoloTipoTerapia>()
                .HasIndex(pt => new { pt.IdProtocolo, pt.IdTipoTerapia })
                .IsUnique();

            modelBuilder.Entity<EquipoSesion>()
                .HasIndex(es => new { es.IdProtocolo, es.IdEquipo })
                .IsUnique();

            // ========================================
            // ÍNDICES ADICIONALES PARA RENDIMIENTO
            // ========================================

            // Búsquedas frecuentes por documento de identidad
            modelBuilder.Entity<Persona>()
                .HasIndex(p => p.DocumentoIdentidad)
                .IsUnique();

            // Búsquedas de citas por fecha
            modelBuilder.Entity<Cita>()
                .HasIndex(c => new { c.IdTerapeuta, c.CheckIn });

            // Búsquedas de disponibilidad
            modelBuilder.Entity<DisponibilidadTerapeuta>()
                .HasIndex(d => new { d.IdTerapeuta, d.DiaSemana });

            // Búsquedas de documentos por paciente
            modelBuilder.Entity<DocumentoPaciente>()
                .HasIndex(d => new { d.IdPaciente, d.FechaSubida });

            // Búsquedas de evolución por paciente
            modelBuilder.Entity<EvolucionPaciente>()
                .HasIndex(e => new { e.IdPaciente, e.Fecha });

            // Búsquedas de alertas no resueltas
            modelBuilder.Entity<AlertaAgenda>()
                .HasIndex(a => new { a.IdTerapeuta, a.Resuelta });

            modelBuilder.Entity<Tratamiento>()
                .HasOne(t => t.Terapeuta)
                .WithMany()
                .HasForeignKey(t => t.IdTerapeuta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlanTratamiento>()
                .HasOne(p => p.Terapeuta)
                .WithMany()
                .HasForeignKey(p => p.IdTerapeuta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlanTratamiento>()
                .HasOne(p => p.Tratamiento)
                .WithMany()
                .HasForeignKey(p => p.IdTratamiento)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlanTratamiento>()
                .HasOne(p => p.Paciente)
                .WithMany()
                .HasForeignKey(p => p.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NotaSesion>()
                .HasOne(n => n.Paciente)
                .WithMany()
                .HasForeignKey(n => n.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<ApiPrueba.Models.Persona> Persona { get; set; } = default!;
    }
}
