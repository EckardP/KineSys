import React, { useEffect, useState } from 'react'

import TherapistCard from '@/components/TherapistCard'
import { crearTerapeuta, listarTerapeutas } from '@/services/terapeutasService'

const normalizarTerapeuta = (terapeuta) => ({
  id: terapeuta.id || terapeuta.documentoIdentidad,
  name: [terapeuta.nombres, terapeuta.apellidos].filter(Boolean).join(' ') || terapeuta.user || 'Terapeuta',
  specialty: terapeuta.tituloAcademico || terapeuta.especialidad?.nombre || 'Sin especialidad',
  availableDays: terapeuta.availableDays || [],
  sessions: terapeuta.sessions || 0,
})

const fetchTherapists = async () => {
  const terapeutas = await listarTerapeutas()
  return (terapeutas || []).map(normalizarTerapeuta)
}

const registerTherapist = async ({ name, specialty }) => {
  const documento = `TEMP-${Date.now()}`
  return crearTerapeuta({
    user: documento,
    password: documento,
    nombres: name.trim(),
    apellidos: '',
    tipoDocumento: 'DNI',
    documentoIdentidad: documento,
    tituloAcademico: specialty.trim(),
    noLicencia: documento,
  })
}

export default function Therapists() {
  const [therapists, setTherapists] = useState([])
  const [form, setForm] = useState({ name: '', specialty: '' })

  // Cargar terapeutas al montar el componente
  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists = async () => {
    const data = await fetchTherapists()
    setTherapists(data)
  }

  const Registrar = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.specialty.trim()) {
      alert('Por favor completa todos los campos')
      return
    }

    await registerTherapist(form)
    await loadTherapists()
    setForm({ name: '', specialty: '' })
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Terapeutas</h2>

      <form className="d-flex gap-2 mb-3" onSubmit={Registrar}>
        <input
          className="form-control"
          placeholder="Nombre"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Especialidad"
          value={form.specialty}
          onChange={e => setForm({ ...form, specialty: e.target.value })}
        />
        <button className="btn btn-primary" type="submit">
          Registrar
        </button>
      </form>

      <div className="row">
        {therapists.map(t => (
          <div className="col-md-4 mb-3" key={t.id}>
            <TherapistCard therapist={t} />
          </div>
        ))}
      </div>
    </div>
  )
}
