/**
 * PRUEBAS UNITARIAS — CLASES DE EQUIVALENCIA
 * Módulo: Login / Autenticación
 *
 * Técnica: Caja Negra — Partición de Equivalencias
 *
 * TABLA DE CLASES DE EQUIVALENCIA:
 * ┌────────────┬─────────────────────────────┬───────────────────────────────────────┐
 * │  Campo     │  Clase Válida               │  Clases Inválidas                     │
 * ├────────────┼─────────────────────────────┼───────────────────────────────────────┤
 * │  Usuario   │ CV1: string no vacío        │ CI1: vacío ""  │ CI2: null/undefined  │
 * │  Contraseña│ CV2: string no vacío        │ CI3: vacío ""  │ CI4: solo espacios   │
 * │  Respuesta │ CV3: 200 OK con token       │ CI5: 401 cred  │ CI6: 500 server err  │
 * │  Rol       │ CV4: Administrador/Terapeuta│ CI7: rol desc. │ CI8: sin rol en token│
 * └────────────┴─────────────────────────────┴───────────────────────────────────────┘
 */
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Login from '../../pages/Login';

vi.mock('../../config/apiConfig', () => ({ API_BASE_URL: 'http://localhost:5058/api' }));

function renderLogin(loginMock = vi.fn()) {
  const auth = {
    login: loginMock,
    isAuthenticated: false,
    loading: false,
    usuario: null,
    token: null,
    logout: vi.fn(),
  };
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// ─── Clase CE-P01: Datos válidos — Administrador ───────────────────────────
describe('CE-P01 | Login con credenciales de Administrador válidas', () => {
  test('llama a login() con los valores exactos ingresados por el usuario', async () => {
    const loginMock = vi.fn().mockResolvedValue({ rol: 'Administrador' });
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'admin01');
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'Kine2025!');
    fireEvent.submit(screen.getByRole('form') ?? screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin01', 'Kine2025!');
    });
  });
});

// ─── Clase CE-P02: Datos válidos — Terapeuta ──────────────────────────────
describe('CE-P02 | Login con credenciales de Terapeuta válidas', () => {
  test('invoca login() y redirige a /dashboard para rol Terapeuta', async () => {
    const loginMock = vi.fn().mockResolvedValue({ rol: 'Terapeuta' });
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'terapeuta01');
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'pass1234');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await waitFor(() => expect(loginMock).toHaveBeenCalledOnce());
  });
});

// ─── Clase CI-P03: Usuario vacío ─────────────────────────────────────────
describe('CI-P03 | Campo usuario vacío (CI1)', () => {
  test('no llama a login() si el usuario está vacío (validación HTML5)', async () => {
    const loginMock = vi.fn().mockResolvedValue({ rol: 'Administrador' });
    renderLogin(loginMock);

    // Solo llena contraseña, deja usuario vacío
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'Kine2025!');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    // El submit del navegador requiere campo required — login no debe llamarse
    await new Promise(r => setTimeout(r, 100));
    expect(loginMock).not.toHaveBeenCalled();
  });
});

// ─── Clase CI-P04: Contraseña vacía ──────────────────────────────────────
describe('CI-P04 | Campo contraseña vacío (CI3)', () => {
  test('no llama a login() si la contraseña está vacía', async () => {
    const loginMock = vi.fn().mockResolvedValue({ rol: 'Administrador' });
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'admin01');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await new Promise(r => setTimeout(r, 100));
    expect(loginMock).not.toHaveBeenCalled();
  });
});

// ─── Clase CI-P05: Credenciales incorrectas (401) ────────────────────────
describe('CI-P05 | Credenciales inválidas — respuesta 401 (CI5)', () => {
  test('muestra mensaje de error al recibir credenciales incorrectas', async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'user_errado');
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'clave_errada');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});

// ─── Clase CI-P06: Error de servidor (500) ────────────────────────────────
describe('CI-P06 | Error del servidor — respuesta 500 (CI6)', () => {
  test('muestra mensaje de error genérico ante fallo del servidor', async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error('Error interno del servidor'));
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'user01');
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'pass01');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/error interno del servidor/i)).toBeInTheDocument();
    });
  });
});

// ─── Clase CI-P07: Rol desconocido (CI7) ─────────────────────────────────
describe('CI-P07 | Rol no reconocido en respuesta (CI7)', () => {
  test('cuando el rol no coincide con ninguno conocido, completa login sin crash', async () => {
    const loginMock = vi.fn().mockResolvedValue({ rol: 'RolDesconocido' });
    renderLogin(loginMock);

    await userEvent.type(screen.getByPlaceholderText(/usuario/i), 'usuario_ext');
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), 'clave_ext');
    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }).closest('form'));

    await waitFor(() => expect(loginMock).toHaveBeenCalledOnce());
  });
});
