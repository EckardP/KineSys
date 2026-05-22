// src/__tests__/integration/audit/AuditDashboard.test.jsx
/**
 * Tests de integración para AuditDashboard.jsx
 * Componente real que useAuditoria hook
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AuditDashboard from '../../../pages/GestionAdmin/audit/AuditDashboard';
import { useAuditoria } from '@/hooks/useAuditoria';

// Mock del hook useAuditoria
jest.mock('@/hooks/useAuditoria');

const mockUseAuditoria = () => ({
  auditorias: [],
  cargando: false,
  error: null,
  conectado: true,
  cargarAuditorias: jest.fn(),
  recargarAuditorias: jest.fn(),
  limpiarError: jest.fn(),
  registrarCreacion: jest.fn(),
  registrarActualizacion: jest.fn(),
  registrarEliminacion: jest.fn(),
  registrarError: jest.fn()
});

describe('AuditDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuditoria.mockReturnValue(mockUseAuditoria());
  });

  test('debe renderizar el dashboard con título', async () => {
    render(<AuditDashboard />);

    expect(screen.getByText('Dashboard de Auditoría')).toBeInTheDocument();
  });

  test('debe mostrar el estado de conexión SignalR', async () => {
    render(<AuditDashboard />);

    // Conectado
    expect(screen.getByText(/conectado/i)).toBeInTheDocument();
  });

  test('debe llamar a cargarAuditorias al montar', async () => {
    const mockCargar = jest.fn();
    useAuditoria.mockReturnValue(mockUseAuditoria({ cargarAuditorias: mockCargar }));

    render(<AuditDashboard />);

    await waitFor(() => {
      expect(mockCargar).toHaveBeenCalledTimes(1);
    });
  });

  test('debe mostrar mensaje de carga mientras cargando', () => {
    const loadingState = mockUseAuditoria();
    loadingState.cargando = true;

    useAuditoria.mockReturnValue(loadingState);
    render(<AuditDashboard />);

    expect(screen.getByText('Cargando auditorías...')).toBeInTheDocument();
  });

  test('debe mostrar error si existe', () => {
    const errorState = mockUseAuditoria();
    errorState.error = 'Error al cargar';
    useAuditoria.mockReturnValue(errorState);

    render(<AuditDashboard />);

    expect(screen.getByText('Error al cargar auditorías.')).toBeInTheDocument();
  });

  test('debe mostrar estadísticas cuando hay datos', async () => {
    const dataState = mockUseAuditoria();
    dataState.auditorias = [
      { id: 1, entidad: 'Pacientes', accion: 'CREATE', exitoso: true },
      { id: 2, entidad: 'Citas', accion: 'UPDATE', exitoso: true },
      { id: 3, entidad: 'Pacientes', accion: 'DELETE', exitoso: false }
    ];
    dataState.cargando = false;
    useAuditoria.mockReturnValue(dataState);

    render(<AuditDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
      expect(screen.getByText('Exitosos: 2')).toBeInTheDocument();
      expect(screen.getByText('Fallidos: 1')).toBeInTheDocument();
    });
  });

  test('debe permitir recargar auditorías', async () => {
    const mockRecargar = jest.fn();
    const state = mockUseAuditoria({ recargarAuditorias: mockRecargar });
    useAuditoria.mockReturnValue(state);

    render(<AuditDashboard />);

    const refreshBtn = screen.getByRole('button', { name: /recargar/i });
    fireEvent.click(refreshBtn);

    expect(mockRecargar).toHaveBeenCalled();
  });

  test('debe permitir limpiar error', async () => {
    const mockLimpiar = jest.fn();
    const errorState = mockUseAuditoria({ limpiarError: mockLimpiar });
    errorState.error = 'Error';
    useAuditoria.mockReturnValue(errorState);

    render(<AuditDashboard />);

    const closeErrorBtn = screen.getByRole('button', { name: /cerrar error/i });
    fireEvent.click(closeErrorBtn);

    expect(mockLimpiar).toHaveBeenCalled();
  });

  test('debe cambiar de pestaña (tabs)', async () => {
    render(<AuditDashboard />);

    const tabButtons = screen.getAllByRole('tab');
    // Pestaña "Detalle" o "Resumen"
    const detailTab = tabButtons.find(tab => tab.textContent.includes('Detalle'));
    if (detailTab) {
      fireEvent.click(detailTab);
      expect(detailTab).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('debe exportar auditorías a CSV', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    render(<AuditDashboard />);

    const exportBtn = screen.getByRole('button', { name: /exportar csv/i });
    fireEvent.click(exportBtn);

    expect(consoleLogSpy).toHaveBeenCalledWith('Exportando auditorías a CSV...');
    consoleLogSpy.mockRestore();
  });
});
