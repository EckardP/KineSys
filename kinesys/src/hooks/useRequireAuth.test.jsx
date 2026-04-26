import { describe, test, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useRequireAuth } from './useRequireAuth';
import { ROLES } from '../utils/constants';

// Componente auxiliar que ejecuta el hook
function ComponenteProtegido({ rolesPermitidos = [] }) {
  const { isAuthenticated } = useRequireAuth(rolesPermitidos);
  return <div data-testid="protegido">Autenticado: {String(isAuthenticated)}</div>;
}

function Pagina({ nombre }) {
  return <div data-testid={nombre}>{nombre}</div>;
}

// Render con MemoryRouter + AuthContext simulado
function renderConContexto({ usuario = null, isAuthenticated = false, loading = false, ruta = '/protegida', roles = [] }) {
  const mockAuth = { usuario, isAuthenticated, loading, token: null, login: vi.fn(), logout: vi.fn() };

  return render(
    <AuthContext.Provider value={mockAuth}>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<Pagina nombre="login" />} />
          <Route path="/dashboard" element={<Pagina nombre="dashboard" />} />
          <Route path="/protegida" element={<ComponenteProtegido rolesPermitidos={roles} />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
describe('useRequireAuth', () => {
  test('redirige a /login si el usuario no está autenticado', async () => {
    const { getByTestId } = renderConContexto({ isAuthenticated: false, loading: false });
    await waitFor(() => {
      expect(getByTestId('login')).toBeInTheDocument();
    });
  });

  test('no redirige mientras loading es true', async () => {
    const { queryByTestId } = renderConContexto({ isAuthenticated: false, loading: true });
    await waitFor(() => {
      expect(queryByTestId('login')).toBeNull();
    });
  });

  test('permite el acceso cuando el usuario tiene el rol correcto', async () => {
    const usuario = { id: '1', rol: 'Terapeuta' };
    const { getByTestId } = renderConContexto({
      usuario,
      isAuthenticated: true,
      loading: false,
      roles: [ROLES.TERAPEUTA],
    });
    await waitFor(() => {
      expect(getByTestId('protegido')).toBeInTheDocument();
    });
  });

  test('redirige a /dashboard cuando el rol del usuario no es permitido', async () => {
    const usuario = { id: '2', rol: 'Paciente' };
    const { getByTestId } = renderConContexto({
      usuario,
      isAuthenticated: true,
      loading: false,
      roles: [ROLES.ADMINISTRADOR],
    });
    await waitFor(() => {
      expect(getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  test('permite el acceso sin verificar rol cuando rolesPermitidos está vacío', async () => {
    const usuario = { id: '3', rol: 'Paciente' };
    const { getByTestId } = renderConContexto({
      usuario,
      isAuthenticated: true,
      loading: false,
      roles: [],
    });
    await waitFor(() => {
      expect(getByTestId('protegido')).toBeInTheDocument();
    });
  });

  test('permite acceso a Administrador con múltiples roles en la lista', async () => {
    const usuario = { id: '4', rol: 'Administrador' };
    const { getByTestId } = renderConContexto({
      usuario,
      isAuthenticated: true,
      loading: false,
      roles: [ROLES.ADMINISTRADOR, ROLES.TERAPEUTA],
    });
    await waitFor(() => {
      expect(getByTestId('protegido')).toBeInTheDocument();
    });
  });
});
