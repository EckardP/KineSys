// src/__tests__/integration/components/DetallesPaciente.test.jsx
/**
 * Tests de integración para DetallesPaciente.jsx
 * Componente que muestra detalles del paciente y carga datos relacionados (EPS, Seguro)
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetallesPaciente from '../../../pages/Gestionpaciente/DetallesPaciente';
import { obtenerEPS } from '../../../services/epsService';
import { obtenerSeguros } from '../../../services/segurosService';

jest.mock('../../../services/epsService');
jest.mock('../../../services/segurosService');

const mockPaciente = {
  id: 1,
  nombreCompleto: 'Juan Pérez',
  documentoIdentidad: '12345678',
  fechaNacimiento: '1990-05-15',
  genero: 'M',
  telefono: '555-1234',
  correoElectronico: 'juan@test.com',
  direccion: 'Calle 123',
  historialMedico: 'Sin antecedentes',
  epsId: 5,
  idSeguroMedico: 3
};

const mockEps = { id: 5, nombre: 'EPS Salud Total' };
const mockSeguro = { id: 3, nombre: 'Seguro Médico ABC', plan: 'Premium' };

describe('DetallesPaciente Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    obtenerEPS.mockResolvedValue(mockEps);
    obtenerSeguros.mockResolvedValue(mockSeguro);
  });

  test('debe renderizar información básica del paciente', () => {
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('juan@test.com')).toBeInTheDocument();
  });

  test('debe cargar EPS cuando epsId está presente', async () => {
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(obtenerEPS).toHaveBeenCalledWith(5);
    });

    expect(await screen.findByText('EPS Salud Total')).toBeInTheDocument();
  });

  test('debe cargar Seguro cuando idSeguroMedico está presente', async () => {
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(obtenerSeguros).toHaveBeenCalledWith(3);
    });

    expect(await screen.findByText('Seguro Médico ABC')).toBeInTheDocument();
  });

  test('no debe llamar a EPS si patient.epsId es null/undefined', async () => {
    const patientSinEps = { ...mockPaciente, epsId: null };
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={patientSinEps} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(obtenerEPS).not.toHaveBeenCalled();
  });

  test('no debe llamar a Seguro si patient.idSeguroMedico es null', async () => {
    const patientSinSeguro = { ...mockPaciente, idSeguroMedico: null };
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={patientSinSeguro} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(obtenerSeguros).not.toHaveBeenCalled();
  });

  test('debe manejar error al cargar EPS', async () => {
    obtenerEPS.mockRejectedValue(new Error('EPS no encontrada'));

    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar EPS.')).toBeInTheDocument();
    });
  });

  test('debe manejar error al cargar Seguro', async () => {
    obtenerSeguros.mockRejectedValue(new Error('Seguro no encontrado'));

    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar Seguro.')).toBeInTheDocument();
    });
  });

  test('debe llamar a onBack al hacer clic en botón volver', async () => {
    const mockOnBack = jest.fn();
    render(
      <MemoryRouter initialEntries={['/pacientes/1']}>
        <Routes>
          <Route path="/pacientes/:id" element={<DetallesPaciente patient={mockPaciente} onBack={mockOnBack} />} />
        </Routes>
      </MemoryRouter>
    );

    // Buscar botón "Volver" (probablemente con icon ArrowLeft y texto)
    const backButton = screen.getByRole('button', { name: /volver/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });
});
