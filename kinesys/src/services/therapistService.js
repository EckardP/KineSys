import { getTherapists, addTherapist } from '../api/therapistsApi'

// Obtener todos los terapeutas
export async function fetchTherapists() {
  return await getTherapists()
}

// Registrar un nuevo terapeuta con validación
export async function registerTherapist(data) {
  if (!data.name || !data.specialty) {
    throw new Error('Faltan datos obligatorios')
  }
  await addTherapist(data)
}


export default { fetchTherapists, registerTherapist }