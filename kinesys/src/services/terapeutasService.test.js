import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  listarTerapeutas,
  obtenerTerapeuta,
  crearTerapeuta,
  actualizarTerapeuta,
  eliminarTerapeuta,
  obtenerTerapeutasActivos,
} from './terapeutasService';

vi.mock('../api/terapeutasApi', () => ({
  default: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import terapeutasApi from '../api/terapeutasApi';

const personasMock = [
  { id: 1, rol: 2, nombres: 'Dr. Ramírez', activo: true  },
  { id: 2, rol: 1, nombres: 'Paciente 1',  activo: true  }, // paciente
  { id: 3, rol: 2, nombres: 'Dra. López',  activo: false },
  { id: 4, rol: 3, nombres: 'Admin',        activo: true  }, // admin
];

beforeEach(() => vi.clearAllMocks());

// ─────────────────────────────────────────────────────────────
// listarTerapeutas
// ─────────────────────────────────────────────────────────────
describe('listarTerapeutas', () => {
  test('filtra correctamente devolviendo solo personas con rol === 2', async () => {
    terapeutasApi.getAll.mockResolvedValue(personasMock);
    const resultado = await listarTerapeutas();
    expect(resultado).toHaveLength(2);
    resultado.forEach(t => expect(t.rol).toBe(2));
  });

  test('devuelve lista vacía si no hay terapeutas', async () => {
    terapeutasApi.getAll.mockResolvedValue([{ id: 1, rol: 1 }]);
    const resultado = await listarTerapeutas();
    expect(resultado).toHaveLength(0);
  });

  test('propaga el error cuando el API falla', async () => {
    terapeutasApi.getAll.mockRejectedValue(new Error('Error de servidor'));
    await expect(listarTerapeutas()).rejects.toThrow('Error de servidor');
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerTerapeuta
// ─────────────────────────────────────────────────────────────
describe('obtenerTerapeuta', () => {
  test('devuelve el terapeuta cuando el rol es 2', async () => {
    terapeutasApi.getById.mockResolvedValue({ id: 1, rol: 2 });
    const resultado = await obtenerTerapeuta(1);
    expect(resultado.id).toBe(1);
  });

  test('lanza error cuando la persona encontrada no es terapeuta', async () => {
    terapeutasApi.getById.mockResolvedValue({ id: 2, rol: 1 }); // paciente
    await expect(obtenerTerapeuta(2)).rejects.toThrow('no es un terapeuta');
  });
});

// ─────────────────────────────────────────────────────────────
// crearTerapeuta
// ─────────────────────────────────────────────────────────────
describe('crearTerapeuta', () => {
  test('asigna rol 2 automáticamente al crear el terapeuta', async () => {
    terapeutasApi.create.mockResolvedValue({ id: 10 });
    await crearTerapeuta({ nombres: 'Dr. Nuevo', documentoIdentidad: '55555555' });

    const [, datos] = terapeutasApi.create.mock.calls[0];
    expect(datos.rol).toBe(2);
  });

  test('marca al terapeuta como activo al crearlo', async () => {
    terapeutasApi.create.mockResolvedValue({ id: 11 });
    await crearTerapeuta({ nombres: 'Dra. Nueva' });

    const [, datos] = terapeutasApi.create.mock.calls[0];
    expect(datos.activo).toBe(true);
  });

  test('usa el endpoint /Register para crear', async () => {
    terapeutasApi.create.mockResolvedValue({ id: 12 });
    await crearTerapeuta({ documentoIdentidad: '66666666' });

    const [endpoint] = terapeutasApi.create.mock.calls[0];
    expect(endpoint).toBe('/Register');
  });
});

// ─────────────────────────────────────────────────────────────
// actualizarTerapeuta
// ─────────────────────────────────────────────────────────────
describe('actualizarTerapeuta', () => {
  test('preserva el rol 2 al actualizar', async () => {
    terapeutasApi.update.mockResolvedValue({ id: 1 });
    await actualizarTerapeuta(1, { nombres: 'Dr. Actualizado' });

    const [, datos] = terapeutasApi.update.mock.calls[0];
    expect(datos.rol).toBe(2);
  });

  test('usa el endpoint /Update/{id}', async () => {
    terapeutasApi.update.mockResolvedValue({ id: 1 });
    await actualizarTerapeuta(1, {});

    const [endpoint] = terapeutasApi.update.mock.calls[0];
    expect(endpoint).toBe('/Update/1');
  });
});

// ─────────────────────────────────────────────────────────────
// eliminarTerapeuta
// ─────────────────────────────────────────────────────────────
describe('eliminarTerapeuta', () => {
  test('llama delete con el id correcto', async () => {
    terapeutasApi.delete.mockResolvedValue(null);
    await eliminarTerapeuta(5);
    expect(terapeutasApi.delete).toHaveBeenCalledWith('5');
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerTerapeutasActivos
// ─────────────────────────────────────────────────────────────
describe('obtenerTerapeutasActivos', () => {
  test('devuelve solo terapeutas con activo === true', async () => {
    terapeutasApi.getAll.mockResolvedValue(personasMock);
    const resultado = await obtenerTerapeutasActivos();
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombres).toBe('Dr. Ramírez');
  });
});
