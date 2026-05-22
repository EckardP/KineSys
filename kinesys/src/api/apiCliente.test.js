import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { crearApiCliente, setAuthToken } from './apiCliente';

const BASE_URL = 'http://localhost:5058/api/TestRecurso';

// Mock de apiConfig para controlar la URL base
vi.mock('../config/apiConfig', () => ({
  getEndpoint: (ruta) => `http://localhost:5058/api/${ruta}`,
}));

// Helper para crear una respuesta fetch simulada
function crearRespuestaOk(data, status = 200) {
  return {
    ok: true,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

function crearRespuestaError(status, mensaje = 'Error') {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ message: mensaje }),
    text: () => Promise.resolve(mensaje),
  };
}

describe('setAuthToken', () => {
  afterEach(() => {
    setAuthToken(null);
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  test('establece el token global que se usará en las solicitudes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(crearRespuestaOk({ id: 1 }));
    vi.stubGlobal('fetch', fetchMock);

    setAuthToken('mi-token-de-prueba');
    const api = crearApiCliente('TestRecurso');
    await api.getAll();

    const [, opciones] = fetchMock.mock.calls[0];
    expect(opciones.headers.Authorization).toBe('Bearer mi-token-de-prueba');
  });

  test('usa el token de sessionStorage si no hay token global', async () => {
    sessionStorage.setItem('authToken', 'token-session');
    const fetchMock = vi.fn().mockResolvedValue(crearRespuestaOk([]));
    vi.stubGlobal('fetch', fetchMock);

    const api = crearApiCliente('TestRecurso');
    await api.getAll();

    const [, opciones] = fetchMock.mock.calls[0];
    expect(opciones.headers.Authorization).toBe('Bearer token-session');
  });

  test('no incluye Authorization si no hay ningún token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(crearRespuestaOk([]));
    vi.stubGlobal('fetch', fetchMock);

    const api = crearApiCliente('TestRecurso');
    await api.getAll();

    const [, opciones] = fetchMock.mock.calls[0];
    expect(opciones.headers.Authorization).toBeUndefined();
  });
});

describe('crearApiCliente — métodos CRUD', () => {
  let api;
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    api = crearApiCliente('TestRecurso');
  });

  afterEach(() => {
    setAuthToken(null);
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  test('getAll() hace GET a la URL base y devuelve los datos', async () => {
    const datos = [{ id: 1 }, { id: 2 }];
    fetchMock.mockResolvedValue(crearRespuestaOk(datos));

    const resultado = await api.getAll();

    expect(resultado).toEqual(datos);
    expect(fetchMock).toHaveBeenCalledWith(BASE_URL, expect.any(Object));
  });

  test('getById() hace GET a la URL con el id', async () => {
    fetchMock.mockResolvedValue(crearRespuestaOk({ id: 5 }));

    await api.getById(5);

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/5`, expect.any(Object));
  });

  test('create() hace POST con los datos serializados', async () => {
    const nuevo = { nombre: 'Test' };
    fetchMock.mockResolvedValue(crearRespuestaOk({ id: 3, ...nuevo }, 201));

    await api.create('', nuevo);

    const [, opciones] = fetchMock.mock.calls[0];
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual(nuevo);
  });

  test('update() hace PUT con los datos en la URL correcta', async () => {
    const actualizado = { id: 2, nombre: 'Actualizado' };
    fetchMock.mockResolvedValue({ ok: true, status: 204, json: () => Promise.resolve(null) });

    await api.update('/2', actualizado);

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/2`);
    expect(opciones.method).toBe('PUT');
  });

  test('delete() hace DELETE en la URL con el id', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 204, json: () => Promise.resolve(null) });

    await api.delete(7);

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/7`);
    expect(opciones.method).toBe('DELETE');
  });

  test('lanza error cuando la respuesta no es ok', async () => {
    fetchMock.mockResolvedValue(crearRespuestaError(404, 'No encontrado'));

    await expect(api.getById(999)).rejects.toThrow('404');
  });

  test('dispara evento auth-token-expired en respuesta 401', async () => {
    sessionStorage.setItem('authToken', 'token-viejo');
    fetchMock.mockResolvedValue(crearRespuestaError(401));

    const eventoSpy = vi.fn();
    window.addEventListener('auth-token-expired', eventoSpy);

    await expect(api.getAll()).rejects.toThrow();

    expect(eventoSpy).toHaveBeenCalled();
    expect(sessionStorage.getItem('authToken')).toBeNull();

    window.removeEventListener('auth-token-expired', eventoSpy);
  });
});
