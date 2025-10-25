import { probarCrearPaciente } from '../services/pacientesService';

// En tu componente
function ComponentePrueba() {
  const handleProbarPost = async () => {
    try {
      const resultado = await probarCrearPaciente();
      alert('Paciente creado exitosamente: ' + JSON.stringify(resultado));
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <button onClick={handleProbarPost}>
      Probar POST de Pacientes
    </button>
  );
}

export default ComponentePrueba;