import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock de apiConfig para evitar import.meta.env en tests
vi.mock('../config/apiConfig', () => ({
  API_BASE_URL: 'http://localhost:5058/api',
}));

// Mock del decodificador JWT para no necesitar tokens reales
vi.mock('../utils/jwt', () => ({
  extraerDatosUsuario: vi.fn(() => ({
    id: '1',
    nombre: 'Test',
    apellidos: 'Usuario',
    nombreCompleto: 'Test Usuario',
    rol: 'Administrador',
    email: 'test@clinica.com',
  })),
}));

// Componente auxiliar para exponer el contexto
function ContextCapture({ onContext }) {
  const ctx = useAuth();
  onContext(ctx);
  return null;
}

function renderConProveedor(onContext) {
  return render(
    <AuthProvider>
      <ContextCapture onContext={onContext} />
    </AuthProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// Estado inicial
// ─────────────────────────────────────────────────────────────
describe('AuthProvider — estado inicial', () => {
  beforeEach(() => sessionStorage.clear());

  test('empieza con isAuthenticated=false y loading=false', async () => {
    let ctx;
    renderConProveedor((c) => { ctx = c; });

    await waitFor(() => expect(ctx.loading).toBe(false));
    expect(ctx.isAuthenticated).toBe(false);
    expect(ctx.usuario).toBeNull();
    expect(ctx.token).toBeNull();
  });

  test('recupera sesión previa desde sessionStorage', async () => {
    const usuarioGuardado = { id: '5', nombre: 'Juan', rol: 'Terapeuta' };
    sessionStorage.setItem('authToken', 'token-guardado');
    sessionStorage.setItem('usuario', JSON.stringify(usuarioGuardado));

    let ctx;
    renderConProveedor((c) => { ctx = c; });

    await waitFor(() => expect(ctx.loading).toBe(false));
    expect(ctx.isAuthenticated).toBe(true);
    expect(ctx.usuario.nombre).toBe('Juan');
    expect(ctx.token).toBe('token-guardado');
  });

  test('ignora sessionStorage corrupto y queda sin autenticar', async () => {
    sessionStorage.setItem('authToken', 'token-viejo');
    sessionStorage.setItem('usuario', 'json-invalido{{{{');

    let ctx;
    renderConProveedor((c) => { ctx = c; });

    await waitFor(() => expect(ctx.loading).toBe(false));
    expect(ctx.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// login()
// ─────────────────────────────────────────────────────────────
describe('AuthProvider — login()', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  afterEach(() => vi.unstubAllGlobals());

  test('hace login exitoso, guarda token y actualiza estado', async () => {
    const respuestaApi = {
      Token: 'jwt-valido-de-prueba',
      Nombres: 'Test',
      Apellidos: 'Usuario',
      Id: 1,
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(respuestaApi),
    }));

    let ctx;
    renderConProveedor((c) => { ctx = c; });
    await waitFor(() => expect(ctx.loading).toBe(false));

    await act(async () => {
      await ctx.login('admin', 'clave123');
    });

    expect(ctx.isAuthenticated).toBe(true);
    expect(ctx.token).toBe('jwt-valido-de-prueba');
    expect(sessionStorage.getItem('authToken')).toBe('jwt-valido-de-prueba');
  });

  test('lanza error y no autentica cuando las credenciales son inválidas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Credenciales inválidas' }),
    }));

    let ctx;
    renderConProveedor((c) => { ctx = c; });
    await waitFor(() => expect(ctx.loading).toBe(false));

    await expect(
      act(async () => { await ctx.login('wrong', 'wrong'); })
    ).rejects.toThrow();

    expect(ctx.isAuthenticated).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// logout()
// ─────────────────────────────────────────────────────────────
describe('AuthProvider — logout()', () => {
  test('limpia el estado y sessionStorage al hacer logout', async () => {
    sessionStorage.setItem('authToken', 'token-activo');
    sessionStorage.setItem('usuario', JSON.stringify({ nombre: 'Juan' }));

    let ctx;
    renderConProveedor((c) => { ctx = c; });
    await waitFor(() => expect(ctx.loading).toBe(false));

    act(() => { ctx.logout(); });

    expect(ctx.isAuthenticated).toBe(false);
    expect(ctx.token).toBeNull();
    expect(ctx.usuario).toBeNull();
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// useAuth() fuera de proveedor
// ─────────────────────────────────────────────────────────────
describe('useAuth — sin proveedor', () => {
  test('lanza error cuando se usa fuera de AuthProvider', () => {
    const renderFuera = () => render(
      <ContextCapture onContext={() => {}} />
    );
    expect(renderFuera).toThrow('useAuth debe usarse dentro de un AuthProvider');
  });
});
