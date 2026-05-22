import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  listarTratamientos,
  obtenerTratamiento,
  crearTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  agregarEquipoATratamiento,
  removerEquipoDeTratamiento,
} from './tratamientosService';

vi.mock('../api/tratamientosApi', () => ({
  tratamientosApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { tratamientosApi } from '../api/tratamientosApi';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listarTratamientos', () => {
  test('devuelve todos los tratamientos del API', async () => {
    const tratamientos = [
      { id: 1, nombre: 'Terapia fisica', activo: true },
      { id: 2, nombre: 'Electroterapia', activo: false },
    ];
    tratamientosApi.getAll.mockResolvedValue(tratamientos);

    const resultado = await listarTratamientos();

    expect(resultado).toEqual(tratamientos);
  });

  test('propaga el error cuando el API falla', async () => {
    tratamientosApi.getAll.mockRejectedValue(new Error('Sin conexion'));

    await expect(listarTratamientos()).rejects.toThrow('Sin conexion');
  });
});

describe('obtenerTratamiento', () => {
  test('devuelve el tratamiento con el id indicado', async () => {
    tratamientosApi.getById.mockResolvedValue({ id: 7, nombre: 'Rehabilitacion' });

    const resultado = await obtenerTratamiento(7);

    expect(tratamientosApi.getById).toHaveBeenCalledWith(7);
    expect(resultado.id).toBe(7);
  });
});

describe('crearTratamiento', () => {
  test('crea el tratamiento usando el endpoint base', async () => {
    const data = { nombre: 'Masaje terapeutico', idEspecialidad: 1 };
    tratamientosApi.create.mockResolvedValue({ id: 10, ...data });

    const resultado = await crearTratamiento(data);

    expect(tratamientosApi.create).toHaveBeenCalledWith('', data);
    expect(resultado.id).toBe(10);
  });

  test('traduce errores 409 a mensaje funcional de tratamiento duplicado', async () => {
    tratamientosApi.create.mockRejectedValue(new Error('409 Conflict'));

    await expect(crearTratamiento({ nombre: 'Duplicado' })).rejects.toThrow(
      'Ya existe un tratamiento con ese nombre'
    );
  });
});

describe('actualizarTratamiento', () => {
  test('actualiza el tratamiento con el id y datos recibidos', async () => {
    const data = { nombre: 'Terapia manual', activo: true };
    tratamientosApi.update.mockResolvedValue({ id: 3, ...data });

    await actualizarTratamiento(3, data);

    expect(tratamientosApi.update).toHaveBeenCalledWith(3, data);
  });
});

describe('eliminarTratamiento', () => {
  test('elimina el tratamiento por id', async () => {
    tratamientosApi.delete.mockResolvedValue(null);

    await eliminarTratamiento(4);

    expect(tratamientosApi.delete).toHaveBeenCalledWith(4);
  });
});

describe('equipos del tratamiento', () => {
  test('agrega un equipo al tratamiento con la ruta anidada correcta', async () => {
    const equipo = { idEquipo: 2, cantidadRequerida: 1 };
    tratamientosApi.create.mockResolvedValue({ ok: true });

    await agregarEquipoATratamiento(9, equipo);

    expect(tratamientosApi.create).toHaveBeenCalledWith('/9/equipos', equipo);
  });

  test('remueve un equipo del tratamiento con la ruta anidada correcta', async () => {
    tratamientosApi.delete.mockResolvedValue(null);

    await removerEquipoDeTratamiento(9, 2);

    expect(tratamientosApi.delete).toHaveBeenCalledWith('/9/equipos/2');
  });
});
