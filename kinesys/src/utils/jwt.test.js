import { describe, test, expect } from 'vitest';
import { decodificarToken, extraerDatosUsuario, tokenExpirado } from './jwt';

// Crea un JWT mock con payload arbitrario (sin firma real)
function crearTokenMock(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const body = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${body}.firma_de_prueba`;
}

const CLAIM_NS = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims';
const ROLE_NS = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

// ─────────────────────────────────────────────────────────────
// decodificarToken
// ─────────────────────────────────────────────────────────────
describe('decodificarToken', () => {
  test('decodifica correctamente un token JWT válido', () => {
    const payload = { sub: '1', name: 'testuser' };
    const token = crearTokenMock(payload);
    const resultado = decodificarToken(token);
    expect(resultado).toMatchObject(payload);
  });

  test('devuelve null para un token con formato inválido', () => {
    expect(decodificarToken('esto.no.es.un.jwt')).toBeNull();
  });

  test('devuelve null para una cadena vacía', () => {
    expect(decodificarToken('')).toBeNull();
  });

  test('preserva caracteres especiales en el payload', () => {
    const payload = { nombre: 'María García', ciudad: 'Bogotá' };
    const token = crearTokenMock(payload);
    const resultado = decodificarToken(token);
    expect(resultado.nombre).toBe('María García');
    expect(resultado.ciudad).toBe('Bogotá');
  });
});

// ─────────────────────────────────────────────────────────────
// extraerDatosUsuario
// ─────────────────────────────────────────────────────────────
describe('extraerDatosUsuario', () => {
  test('extrae correctamente los claims de ASP.NET Identity', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = {
      [`${CLAIM_NS}/nameidentifier`]: '42',
      [`${CLAIM_NS}/name`]: 'jdoe',
      FullName: 'Juan Doe',
      [`${CLAIM_NS}/emailaddress`]: 'juan@clinica.com',
      [ROLE_NS]: 'Terapeuta',
      exp,
    };
    const token = crearTokenMock(payload);
    const datos = extraerDatosUsuario(token);

    expect(datos.id).toBe('42');
    expect(datos.usuario).toBe('jdoe');
    expect(datos.nombreCompleto).toBe('Juan Doe');
    expect(datos.email).toBe('juan@clinica.com');
    expect(datos.rol).toBe('Terapeuta');
    expect(datos.exp).toBe(exp);
  });

  test('usa claims alternativos cuando los principales no están presentes', () => {
    const payload = {
      nameid: '10',
      unique_name: 'admin1',
      role: 'Administrador',
      email: 'admin@clinica.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = crearTokenMock(payload);
    const datos = extraerDatosUsuario(token);

    expect(datos.id).toBe('10');
    expect(datos.usuario).toBe('admin1');
    expect(datos.rol).toBe('Administrador');
  });

  test('devuelve null para un token inválido', () => {
    expect(extraerDatosUsuario('token.invalido')).toBeNull();
  });

  test('extrae el rol de Paciente correctamente', () => {
    const payload = { [ROLE_NS]: 'Paciente', exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = crearTokenMock(payload);
    const datos = extraerDatosUsuario(token);
    expect(datos.rol).toBe('Paciente');
  });
});

// ─────────────────────────────────────────────────────────────
// tokenExpirado
// ─────────────────────────────────────────────────────────────
describe('tokenExpirado', () => {
  test('devuelve true para un token ya expirado', () => {
    const token = crearTokenMock({ exp: Math.floor(Date.now() / 1000) - 60 });
    expect(tokenExpirado(token)).toBe(true);
  });

  test('devuelve false para un token vigente', () => {
    const token = crearTokenMock({ exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(tokenExpirado(token)).toBe(false);
  });

  test('devuelve true cuando el token no tiene campo exp', () => {
    const token = crearTokenMock({ sub: '1', name: 'sin-exp' });
    expect(tokenExpirado(token)).toBe(true);
  });

  test('devuelve true para un token con formato completamente inválido', () => {
    expect(tokenExpirado('no.es.un.token')).toBe(true);
  });
});
