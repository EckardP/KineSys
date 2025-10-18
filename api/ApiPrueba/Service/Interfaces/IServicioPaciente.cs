using ApiPrueba.DTO;

namespace ApiPrueba.Service.Interfaces
{
    namespace ApiPrueba.Service.Interfaces
    {
        public interface IServicioPaciente
        {
            Task<IEnumerable<PacienteDTO>> ObtenerTodos();
            Task<PacienteDTO> ObtenerPorId(int id);
            Task Crear(PacienteDTO paciente);
            Task<bool> Actualizar(PacienteDTO paciente);
            Task<bool> Eliminar(int id);
        }
    }
}
