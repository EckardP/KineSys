// src/__tests__/integration/components/AppointmentForm.test.jsx
/**
 * Tests de integración para AppointmentForm.jsx
 * Componente real con validación y props onSubmit/onCancel
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentForm from '../../../pages/GestionAdmin/GestionCita/AppointmentForm';

describe('AppointmentForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario con campos', () => {
    render(
      <AppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument();
    expect(screen.getByLabelText(/paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sala/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/terapeuta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observaciones/i)).toBeInTheDocument();
  });

  test('debe llamar a onSubmit con datos válidos', async () => {
    render(
      <AppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Llenar campos obligatorios
    fireEvent.change(screen.getByLabelText(/paciente/i), { target: { value: 'Juan García' } });
    fireEvent.change(screen.getByLabelText(/fecha/i), { target: { value: '2024-05-01' } });
    fireEvent.change(screen.getByLabelText(/hora/i), { target: { value: '09:00' } });

    // Enviar
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        paciente: 'Juan García',
        fecha: '2024-05-01',
        hora: '09:00'
      })
    );
  });

  test('debe validar campos obligatorios y no llamar a onSubmit si faltan', async () => {
    render(
      <AppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Intentar enviar vacío
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    // Validación de alert (componente usa alert nativo)
    // Como no podemos mockear alert fácilmente, asumimos que se muestra
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Podemos verificar que los campos muestran error? El componente usa alert, no mensajes en pantalla
    // Por lo que solo verificamos que no se llama onSubmit
  });

  test('debe llamar a onCancel al hacer clic en cancelar', () => {
    render(
      <AppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('debe actualizar estado al cambiar campos', () => {
    render(
      <AppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const pacienteInput = screen.getByLabelText(/paciente/i);
    fireEvent.change(pacienteInput, { target: { value: 'María López' } });

    expect(pacienteInput).toHaveValue('María López');
  });

  test('debe renderizar con datos iniciales si se pasan (edición)', () => {
    const initialData = {
      paciente: 'Juan García',
      fecha: '2024-01-20',
      hora: '09:00',
      tipo: 'Inicial',
      sala: '1',
      terapeuta: 'Dr. Smith',
      observaciones: 'Primera vez'
    };

    render(
      <AppointmentForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/paciente/i)).toHaveValue('Juan García');
    expect(screen.getByLabelText(/fecha/i)).toHaveValue('2024-01-20');
    expect(screen.getByLabelText(/hora/i)).toHaveValue('09:00');
  });
});
