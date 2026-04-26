import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  listarPacientes,
  obtenerPaciente,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from './pacientesService';

vi.mock('../api/pacientesApi', () => ({
  default: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import pacientesApi from '../api/pacientesApi';

// Personas de prueba (mezcla de roles)
const personasMock = [
  { id: 1, rol: 1, nombres: 'Ana',    activo: true,  documentoIdentidad: '11111111' },
  { id: 2, rol: 2, nombres: 'Carlos', activo: true,  documentoIdentidad: '22222222' }, // terapeuta
  { id: 3, rol: 1, nombres: 'Luis',   activo: false, documentoIdentidad: '33333333' },
  { id: 4, rol: 3, nombres: 'Admin',  activo: true,  documentoIdentidad: '44444444' }, // admin
];

beforeEach(() => vi.clearAllMocks());

// ─────────────────────────────────────────────────────────────
// listarPacientes
// ─────────────────────────────────────────────────────────────
describe('listarPacientes', () => {
  test('filtra correctamente devolviendo solo personas con rol === 1', async () => {
    pacientesApi.getAll.mockResolvedValue(personasMock);
    const resultado = await listarPacientes();
    expect(resultado).toHaveLength(2);
    resultado.forEach(p => expect(p.rol).toBe(1));
  });

  test('devuelve lista vacía si no hay pacientes registrados', async () => {
    pacientesApi.getAll.mockResolvedValue([{ id: 1, rol: 2 }, { id: 2, rol: 3 }]);
    const resultado = await listarPacientes();
    expect(resultado).toHaveLength(0);
  });

  test('propaga el error cuando el API falla', async () => {
    pacientesApi.getAll.mockRejectedValue(new Error('Sin conexión'));
    await expect(listarPacientes()).rejects.toThrow('Sin conexión');
  });
});

// ─────────────────────────────────────────────────────────────
// obtenerPaciente
// ─────────────────────────────────────────────────────────────
describe('obtenerPaciente', () => {
  test('devuelve el paciente cuando el rol es 1', async () => {
    pacientesApi.getById.mockResolvedValue({ id: 1, rol: 1, nombres: 'Ana' });
    const resultado = await obtenerPaciente(1);
    expect(resultado.id).toBe(1);
  });

  test('lanza error cuando la persona encontrada no es paciente', async () => {
    pacientesApi.getById.mockResolvedValue({ id: 2, rol: 2 }); // terapeuta
    await expect(obtenerPaciente(2)).rejects.toThrow('no es un paciente');
  });
});

// ─────────────────────────────────────────────────────────────
// crearPaciente
// ─────────────────────────────────────────────────────────────
describe('crearPaciente', () => {
  test('envía datos con user y password iguales al documentoIdentidad', async () => {
    pacientesApi.create.mockResolvedValue({ id: 5 });

    await crearPaciente({ nombres: 'Nuevo', documentoIdentidad: '12345678' });

    const [, datosEnviados] = pacientesApi.create.mock.calls[0];
    expect(datosEnviados.user).toBe('12345678');
    expect(datosEnviados.password).toBe('12345678');
  });

  test('marca al paciente como activo al crearlo', async () => {
    pacientesApi.create.mockResolvedValue({ id: 6 });
    await crearPaciente({ documentoIdentidad: '87654321' });

    const [, datosEnviados] = pacientesApi.create.mock.calls[0];
    expect(datosEnviados.activo).toBe(true);
  });

  test('incluye fechaRegistro en los datos enviados', async () => {
    pacientesApi.create.mockResolvedValue({ id: 7 });
    await crearPaciente({ documentoIdentidad: '99999999' });

    const [, datosEnviados] = pacientesApi.create.mock.calls[0];
    expect(datosEnviados.fechaRegistro).toBeDefined();
  });

  test('usa el endpoint /Register para crear', async () => {
    pacientesApi.create.mockResolvedValue({ id: 8 });
    await crearPaciente({ documentoIdentidad: '00000001' });

    const [endpoint] = pacientesApi.create.mock.calls[0];
    expect(endpoint).toBe('/Register');
  });
});

// ─────────────────────────────────────────────────────────────
// actualizarPaciente
// ─────────────────────────────────────────────────────────────
describe('actualizarPaciente', () => {
  test('llama update con el endpoint correcto y los datos', async () => {
    pacientesApi.update.mockResolvedValue({ id: 1, nombres: 'Ana Actualizada' });
    const datos = { nombres: 'Ana Actualizada', documentoIdentidad: '11111111' };

    await actualizarPaciente(1, datos);

    expect(pacientesApi.update).toHaveBeenCalledWith('/Update/1', datos);
  });
});

// ─────────────────────────────────────────────────────────────
// eliminarPaciente
// ─────────────────────────────────────────────────────────────
describe('eliminarPaciente', () => {
  test('llama delete con el id correcto', async () => {
    pacientesApi.delete.mockResolvedValue(null);
    await eliminarPaciente(3);
    expect(pacientesApi.delete).toHaveBeenCalledWith('3');
  });

  test('propaga el error si la eliminación falla', async () => {
    pacientesApi.delete.mockRejectedValue(new Error('No se puede eliminar'));
    await expect(eliminarPaciente(99)).rejects.toThrow('No se puede eliminar');
  });
});
