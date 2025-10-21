using ApiPrueba.Models;
using ApiPrueba.Service.Implementaciones;
using ApiPrueba.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace ApiPrueba.data
{
    /// <summary>
    /// Contexto principal de la base de datos para la clínica de fisioterapia.
    /// Contiene todos los DbSet y relaciones entre entidades.
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
        public DbSet<ProtocoloTratamiento> ProtocolosTratamiento { get; set; }
        public DbSet<EquipoSesion> EquiposSesion { get; set; }
        public DbSet<Tratamiento> Tratamientos { get; set; }

        // =======================
        // AGENDA Y CITAS
        // =======================
        public DbSet<ReservaCita> ReservasCita { get; set; }
        public DbSet<AlertaAgenda> AlertasAgenda { get; set; }

        // =======================
        // NOTAS POR SESIÓN
        // =======================
        public DbSet<NotaSesion> NotasSesion { get; set; }

        // =======================
        // ESPECIALIDAD 
        // =======================
        public DbSet<Especialidad> Especialidades { get; set; }

        // =======================
        // CONFIGURACIÓN DE MODELOS
        // =======================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Nombres de tablas explícitos
            modelBuilder.Entity<Paciente>().ToTable("Pacientes");
            modelBuilder.Entity<Terapeuta>().ToTable("Terapeutas");
            modelBuilder.Entity<Cita>().ToTable("Citas");
            modelBuilder.Entity<Equipo>().ToTable("Equipos");
            modelBuilder.Entity<ContactoEmergencia>().ToTable("ContactosEmergencia");
            modelBuilder.Entity<DocumentoPaciente>().ToTable("DocumentosPaciente");
            modelBuilder.Entity<EvolucionPaciente>().ToTable("EvolucionesPaciente");
            modelBuilder.Entity<DisponibilidadTerapeuta>().ToTable("DisponibilidadesTerapeutas");
            modelBuilder.Entity<ProtocoloTratamiento>().ToTable("ProtocolosTratamiento");
            modelBuilder.Entity<EquipoSesion>().ToTable("EquiposSesion");
            modelBuilder.Entity<Especialidad>().ToTable("Especialidad");
            //Tratamiento
            modelBuilder.Entity<ReservaCita>().ToTable("ReservasCita");
            modelBuilder.Entity<AlertaAgenda>().ToTable("AlertasAgenda");
            modelBuilder.Entity<NotaSesion>().ToTable("NotasSesion");


            // Relaciones principales
            modelBuilder.Entity<ContactoEmergencia>()
                .HasOne(p => p.Paciente)
                .WithMany(p => p.ContactosEmergencia)
                .HasForeignKey(p => p.IdPaciente)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tratamiento>()
               .HasOne(t => t.PlanTratamiento)
               .WithOne(p => p.Tratamiento)
               .HasForeignKey<PlanTratamiento>(p => p.IdTratamiento);

            modelBuilder.Entity<Tratamiento>()
                .HasOne(t => t.Paciente)
                .WithMany()
                .HasForeignKey(t => t.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict); // Evita cascada circular

            modelBuilder.Entity<Tratamiento>()
                .HasOne(t => t.Terapeuta)
                .WithMany()
                .HasForeignKey(t => t.IdTerapeuta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EvolucionPaciente>()
                .Property(e => e.Valor)
                .HasPrecision(18, 2);

            modelBuilder.Entity<DocumentoPaciente>()
                .HasOne(p => p.Paciente)
                .WithMany(p => p.Documentos)
                .HasForeignKey(p => p.IdPaciente)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EvolucionPaciente>()
                .HasOne(p => p.Paciente)
                .WithMany(p => p.Evoluciones)
                .HasForeignKey(p => p.IdPaciente)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DisponibilidadTerapeuta>()
                .HasOne(d => d.Terapeuta)
                .WithMany(t => t.Disponibilidades)
                .HasForeignKey(d => d.IdTerapeuta)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EquipoSesion>()
                .HasOne(e => e.ProtocoloTratamiento)
                .WithMany(p => p.EquiposRequeridos)
                .HasForeignKey(e => e.IdProtocolo)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EquipoSesion>()
                .HasOne(e => e.Equipo)
                .WithMany()
                .HasForeignKey(e => e.IdEquipo)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AlertaAgenda>()
                .HasOne(a => a.Cita)
                .WithMany()
                .HasForeignKey(a => a.IdCita)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AlertaAgenda>()
                .HasOne(a => a.Terapeuta)
                .WithMany()
                .HasForeignKey(a => a.IdTerapeuta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReservaCita>()
                .HasOne(r => r.Cita)
                .WithOne(c => c.Reserva)
                .HasForeignKey<ReservaCita>(r => r.IdCita)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NotaSesion>()
                .HasOne(n => n.Cita)
                .WithOne(c => c.NotaSesion)
                .HasForeignKey<NotaSesion>(n => n.IdCita)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NotaSesion>()
                .HasOne(n => n.Paciente)
                .WithMany()
                .HasForeignKey(n => n.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);

            // Claves compuestas opcionales
            modelBuilder.Entity<DisponibilidadTerapeuta>()
                .HasIndex(d => new { d.IdTerapeuta, d.DiaSemana })
                .IsUnique();
        }
    }
}
