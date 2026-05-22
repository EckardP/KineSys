import { describe, test, expect } from 'vitest';
import { ROLES, hasRole, hasAnyRole } from './constants';

// ─────────────────────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────────────────────
describe('ROLES', () => {
  test('contiene los tres roles del sistema', () => {
    expect(Object.keys(ROLES)).toHaveLength(3);
  });

  test('ADMINISTRADOR coincide con el string del backend', () => {
    expect(ROLES.ADMINISTRADOR).toBe('Administrador');
  });

  test('TERAPEUTA coincide con el string del backend', () => {
    expect(ROLES.TERAPEUTA).toBe('Terapeuta');
  });

  test('PACIENTE coincide con el string del backend', () => {
    expect(ROLES.PACIENTE).toBe('Paciente');
  });
});

// ─────────────────────────────────────────────────────────────
// hasRole
// ─────────────────────────────────────────────────────────────
describe('hasRole', () => {
  test('devuelve true cuando el usuario tiene exactamente el rol indicado', () => {
    expect(hasRole({ rol: 'Terapeuta' }, ROLES.TERAPEUTA)).toBe(true);
  });

  test('devuelve false cuando el usuario tiene un rol diferente', () => {
    expect(hasRole({ rol: 'Paciente' }, ROLES.TERAPEUTA)).toBe(false);
  });

  test('devuelve false para usuario null', () => {
    expect(hasRole(null, ROLES.TERAPEUTA)).toBe(false);
  });

  test('devuelve false para usuario undefined', () => {
    expect(hasRole(undefined, ROLES.ADMINISTRADOR)).toBe(false);
  });

  test('es sensible a mayúsculas (no acepta "terapeuta" en minúscula)', () => {
    expect(hasRole({ rol: 'terapeuta' }, ROLES.TERAPEUTA)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// hasAnyRole
// ─────────────────────────────────────────────────────────────
describe('hasAnyRole', () => {
  test('devuelve true cuando el usuario tiene uno de los roles de la lista', () => {
    const usuario = { rol: 'Administrador' };
    expect(hasAnyRole(usuario, [ROLES.ADMINISTRADOR, ROLES.TERAPEUTA])).toBe(true);
  });

  test('devuelve false cuando el usuario no tiene ningún rol de la lista', () => {
    const usuario = { rol: 'Paciente' };
    expect(hasAnyRole(usuario, [ROLES.ADMINISTRADOR, ROLES.TERAPEUTA])).toBe(false);
  });

  test('devuelve true con lista que contiene un solo rol coincidente', () => {
    expect(hasAnyRole({ rol: 'Paciente' }, [ROLES.PACIENTE])).toBe(true);
  });

  test('devuelve false para usuario null', () => {
    expect(hasAnyRole(null, [ROLES.ADMINISTRADOR])).toBe(false);
  });

  test('devuelve false para lista de roles vacía', () => {
    expect(hasAnyRole({ rol: 'Terapeuta' }, [])).toBe(false);
  });
});
