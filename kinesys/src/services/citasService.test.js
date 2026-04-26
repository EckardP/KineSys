import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  listarCitas,
  obtenerCita,
  crearCita,
  eliminarCita,
  buscarCitasPorPaciente,
  buscarCitasPorTerapeuta,
  filtrarCitasPorEstado,
  verificarDisponibilidad,
  obtenerResumenCitas,
  obtenerCitasHoy,
} from './citasService';

// ── Mocks ─────────────────────────────────────────────────────
vi.mock('../api/citasApi', () => ({
  default: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./disponibilidadTerapeutaService', () => ({
  actualizarDisponibilidad: vi.fn(),
  liberarDisponibilidad: vi.fn(),
}));

import citasApi from '../api/citasApi';
import { actualizarDisponibilidad, liberarDisponibilidad } from './disponibilidadTerapeutaService';

// ── Datos de prueba ────────────────────────────────────────────
const citasMock = [
  { idCita: 1, estado: 'Programada',  idPaciente: 10, idTerapeuta: 20, fechaHora: new Date().toISOString(), duracionProgramadaMin: 30 },
  { idCita: 2, estado: 'Completada',  idPaciente: 11, idTerapeuta: 20, fechaHora: new Date().toISOString(), duracionProgramadaMin: 45, precioCita: 80000 },
  { idCita: 3, estado: 'Cancelada',   idPaciente: 10, idTerapeuta: 21, fechaHora: new Date().toISOString(), duracionProgramadaMin: 30 },
  { idCita: 4, estado: 'Confirmada',  idPaciente: 12, idTerapeuta: 21, fechaHora: new Date().toISOString(), duracionProgramadaMin: 60, precioCita: 120000 },
];

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────
// listarCitas
// ─────────────────────────────────────────────────────────────
describe('listarCitas', () => {
  test('devuelve todas las citas del API', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await listarCitas();
    expect(resultado).toHaveLength(4);
    expect(citasApi.getAll).toHaveBeenCalledOnce();
  });

  test('propaga el error cuando el API falla', async () => {
    citasApi.getAll.mockRejectedValue(new Error('Error de red'));
    await expect(listarCitas()).rejects.toThrow('Error de red');
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerCita
// ─────────────────────────────────────────────────────────────
describe('obtenerCita', () => {
  test('devuelve la cita con el id especificado', async () => {
    citasApi.getById.mockResolvedValue(citasMock[0]);
    const resultado = await obtenerCita(1);
    expect(resultado.idCita).toBe(1);
    expect(citasApi.getById).toHaveBeenCalledWith(1);
  });
});

// ─────────────────────────────────────────────────────────────
// crearCita
// ─────────────────────────────────────────────────────────────
describe('crearCita', () => {
  test('crea la cita y actualiza disponibilidad cuando se provee idDisponibilidad', async () => {
    const citaCreada = { idCita: 5, estado: 'Programada' };
    citasApi.create.mockResolvedValue(citaCreada);
    actualizarDisponibilidad.mockResolvedValue({});

    const datos = { estado: 'Programada', idPaciente: 10, idTerapeuta: 20, idDisponibilidad: 99 };
    const resultado = await crearCita(datos);

    expect(citasApi.create).toHaveBeenCalledWith('', { estado: 'Programada', idPaciente: 10, idTerapeuta: 20 });
    expect(actualizarDisponibilidad).toHaveBeenCalledWith(99, { idCita: 5, disponible: false });
    expect(resultado.idDisponibilidad).toBe(99);
  });

  test('crea la cita sin actualizar disponibilidad cuando no se provee idDisponibilidad', async () => {
    const citaCreada = { idCita: 6, estado: 'Programada' };
    citasApi.create.mockResolvedValue(citaCreada);

    await crearCita({ estado: 'Programada', idPaciente: 10, idTerapeuta: 20 });

    expect(actualizarDisponibilidad).not.toHaveBeenCalled();
  });

  test('revierte la cita si falla la actualización de disponibilidad', async () => {
    const citaCreada = { idCita: 7, estado: 'Programada' };
    citasApi.create.mockResolvedValue(citaCreada);
    citasApi.delete.mockResolvedValue(null);
    actualizarDisponibilidad.mockRejectedValue(new Error('Disponibilidad ocupada'));

    await expect(
      crearCita({ estado: 'Programada', idPaciente: 10, idTerapeuta: 20, idDisponibilidad: 88 })
    ).rejects.toThrow('Error al reservar el horario');

    expect(citasApi.delete).toHaveBeenCalledWith(7);
  });
});

// ─────────────────────────────────────────────────────────────
// eliminarCita
// ─────────────────────────────────────────────────────────────
describe('eliminarCita', () => {
  test('elimina la cita y libera su disponibilidad si la tenía', async () => {
    const citaConDisp = { idCita: 1, idDisponibilidad: 55 };
    citasApi.getById.mockResolvedValue(citaConDisp);
    citasApi.delete.mockResolvedValue(null);
    liberarDisponibilidad.mockResolvedValue({});

    await eliminarCita(1);

    expect(citasApi.delete).toHaveBeenCalledWith(1);
    expect(liberarDisponibilidad).toHaveBeenCalledWith(55);
  });

  test('elimina la cita sin llamar liberarDisponibilidad si no tenía asignada', async () => {
    citasApi.getById.mockResolvedValue({ idCita: 2 });
    citasApi.delete.mockResolvedValue(null);

    await eliminarCita(2);

    expect(liberarDisponibilidad).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// Filtros de búsqueda
// ─────────────────────────────────────────────────────────────
describe('buscarCitasPorPaciente', () => {
  test('devuelve solo las citas del paciente indicado', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await buscarCitasPorPaciente(10);
    expect(resultado).toHaveLength(2);
    resultado.forEach(c => expect(c.idPaciente).toBe(10));
  });

  test('devuelve lista vacía si el paciente no tiene citas', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await buscarCitasPorPaciente(99);
    expect(resultado).toHaveLength(0);
  });
});

describe('buscarCitasPorTerapeuta', () => {
  test('devuelve solo las citas del terapeuta indicado', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await buscarCitasPorTerapeuta(20);
    expect(resultado).toHaveLength(2);
    resultado.forEach(c => expect(c.idTerapeuta).toBe(20));
  });
});

describe('filtrarCitasPorEstado', () => {
  test('filtra correctamente por estado (insensible a mayúsculas)', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await filtrarCitasPorEstado('completada');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].estado).toBe('Completada');
  });

  test('devuelve lista vacía para un estado inexistente', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resultado = await filtrarCitasPorEstado('Inasistencia');
    expect(resultado).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerResumenCitas
// ─────────────────────────────────────────────────────────────
describe('obtenerResumenCitas', () => {
  test('calcula correctamente el resumen de estados y totales', async () => {
    citasApi.getAll.mockResolvedValue(citasMock);
    const resumen = await obtenerResumenCitas();

    expect(resumen.total).toBe(4);
    expect(resumen.programadas).toBe(1);
    expect(resumen.completadas).toBe(1);
    expect(resumen.canceladas).toBe(1);
    expect(resumen.confirmadas).toBe(1);
    expect(resumen.ingresosTotales).toBe(200000);
  });
});

// ─────────────────────────────────────────────────────────────
// verificarDisponibilidad
// ─────────────────────────────────────────────────────────────
describe('verificarDisponibilidad', () => {
  test('devuelve true cuando no hay conflictos de horario', async () => {
    citasApi.getAll.mockResolvedValue([]);
    const disponible = await verificarDisponibilidad(20, new Date().toISOString(), 30);
    expect(disponible).toBe(true);
  });

  test('devuelve false cuando existe solapamiento con otra cita', async () => {
    const ahora = new Date();
    const citaExistente = {
      idCita: 1,
      idTerapeuta: 20,
      estado: 'Confirmada',
      fechaHora: ahora.toISOString(),
      duracionProgramadaMin: 60,
    };
    citasApi.getAll.mockResolvedValue([citaExistente]);

    // Intentar agendar 15 minutos después (solapamiento)
    const inicio = new Date(ahora.getTime() + 15 * 60 * 1000).toISOString();
    const disponible = await verificarDisponibilidad(20, inicio, 30);
    expect(disponible).toBe(false);
  });

  test('ignora las citas canceladas al verificar disponibilidad', async () => {
    const ahora = new Date();
    const citaCancelada = {
      idCita: 2,
      idTerapeuta: 20,
      estado: 'Cancelada',
      fechaHora: ahora.toISOString(),
      duracionProgramadaMin: 60,
    };
    citasApi.getAll.mockResolvedValue([citaCancelada]);

    const disponible = await verificarDisponibilidad(20, ahora.toISOString(), 30);
    expect(disponible).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerCitasHoy
// ─────────────────────────────────────────────────────────────
describe('obtenerCitasHoy', () => {
  test('devuelve solo las citas del día actual', async () => {
    const hoy = new Date();
    const citaHoy = { idCita: 10, fechaHora: hoy.toISOString() };
    const citaAyer = { idCita: 11, fechaHora: new Date(hoy - 86400000).toISOString() };
    citasApi.getAll.mockResolvedValue([citaHoy, citaAyer]);

    const resultado = await obtenerCitasHoy();
    expect(resultado).toHaveLength(1);
    expect(resultado[0].idCita).toBe(10);
  });
});
