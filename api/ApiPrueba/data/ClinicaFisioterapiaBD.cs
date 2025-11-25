using Microsoft.EntityFrameworkCore;
using ApiPrueba.Models;

namespace ApiPrueba.Data
{
    
    public class ClinicaFisioterapiaBD : DbContext
    {
        public ClinicaFisioterapiaBD(DbContextOptions<ClinicaFisioterapiaBD> options)
            : base(options)
        {
        }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Terapeuta> Terapeutas { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Equipo> Equipos { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<TipoTerapia> TipoTerapias { get; set; }
        public DbSet<SeguroMedico> SegurosMedicos { get; set; }
        public DbSet<EPS> Epss { get; set; }
        public DbSet<Factura> facturas { get; set; }
        public DbSet<Auditoria> auditorias { get; set; }

        public DbSet<ContactoEmergencia> ContactosEmergencia { get; set; }
        public DbSet<DocumentoPaciente> DocumentosPaciente { get; set; }
        public DbSet<EvolucionPaciente> EvolucionesPaciente { get; set; }

        public DbSet<DisponibilidadTerapeuta> DisponibilidadesTerapeutas { get; set; }

        public DbSet<Tratamiento> Tratamientos { get; set; }
        public DbSet<PlanTratamiento> PlanTratamientos { get; set; }
        public DbSet<ProtocoloTratamiento> ProtocoloTratamientos { get; set; }

        public DbSet<ReservaCita> ReservasCita { get; set; }
        public DbSet<AlertaAgenda> AlertasAgenda { get; set; }
        public DbSet<NotaSesion> NotasSesion { get; set; }

        public DbSet<Diagnostico> Diagnosticos { get; set; }
       

        public DbSet<HistorialMedico> HistorialMedicos { get; set; }

        public DbSet<OrdenMedica> OrdenesMedicas { get; set; }
        public DbSet<TipoServicio> TipoServicios { get; set; }
        public DbSet<Sala> Salas { get; set; }
        public DbSet<AutorizacionSesiones> AutorizacionSesiones { get; set; }


        //tablas intermedias N:N


        public DbSet<EquiposRequeridos> EquiposRequeridos { get; set; }
        public DbSet<TipoServicioEspecialidad> TipoServicioEspecialidads { get; set; }
        public DbSet<EquipoSesion> EquiposSesion { get; set; }
        public DbSet<TerapeutaEspecialidad> TerapeutaEspecialidades { get; set; }
        public DbSet<TratamientoProtocolo> TratamientoProtocolos { get; set; }
        public DbSet<TratamientoTipoTerapia> TratamientoTipoTerapias { get; set; }
        public DbSet<ProtocoloTipoTerapia> ProtocoloTipoTerapias { get; set; }

        public DbSet<ContratoSeguro> ContratosSeguro { get; set; }

        //Modelos
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

            //Relacion herencia Persona -> Paciente / Terapeuta
            modelBuilder.Entity<Persona>()
                .HasDiscriminator<string>("TipoPersona")
                .HasValue<Paciente>("Paciente")
                .HasValue<Terapeuta>("Terapeuta")
                .HasValue<Administrador>("Administrador");

            //tablas intermedias N:N con índices únicos

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

            //Relacion 1:1 de Administrador con Persona
            //modelBuilder.Entity<Administrador>()
            //    .HasOne(a => a.Persona)
            //    .WithOne(p => p.Usuario)
            //    .HasForeignKey<Administrador>(a => a.IdPersona);

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

            modelBuilder.Entity<Diagnostico>()
                .HasOne(d => d.Paciente)
                .WithMany()
                .HasForeignKey(d => d.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Diagnostico>()
                .HasOne(d => d.Terapeuta)
                .WithMany() 
                .HasForeignKey(d => d.IdTerapeuta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Diagnostico>()
                .HasOne(d => d.Tratamiento)
                .WithMany()
                .HasForeignKey(d => d.IdTratamiento)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<HistorialMedico>()
                .HasOne(h => h.Paciente)
                .WithOne(p => p.HistorialMedico)
                .HasForeignKey<HistorialMedico>(h => h.IdPaciente);

        }

        

        public DbSet<ApiPrueba.Models.Persona> Persona { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.Factura> Factura { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.Auditoria> Auditoria { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.OrdenMedica> OrdenMedica { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.TipoServicio> TipoServicio { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.TipoServicioEspecialidad> TipoServicioEspecialidad { get; set; } = default!;
    
public DbSet<ApiPrueba.Models.Sala> Sala { get; set; } = default!;
    }
}
