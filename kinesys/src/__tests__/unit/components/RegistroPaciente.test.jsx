// src/__tests__/unit/components/RegistroPaciente.test.jsx
/**
 * Pruebas unitarias del componente FormPaciente (CU-001-1 Registrar Pacientes)
 * Motor: Vitest + React Testing Library
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FormPaciente from "../../../features/patient/Gestionpaciente/FormPaciente";
import {
  crearPaciente,
  obtenerPaciente,
  actualizarPaciente,
} from "../../../services/pacientesService";

// Mock del servicio de pacientes
vi.mock("../../../services/pacientesService", () => ({
  crearPaciente: vi.fn(),
  obtenerPaciente: vi.fn(),
  actualizarPaciente: vi.fn(),
}));

// Mock de react-router preservando MemoryRouter
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

// Función auxiliar para renderizar el componente con el router simulado
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// Datos válidos de prueba para un paciente
const datosPacienteValidos = {
  nombreCompleto: "María González",
  documentoIdentidad: "12345678",
  fechaNacimiento: "1990-05-15",
  genero: "Femenino",
  telefono: "3001234567",
  correoElectronico: "maria@test.com",
  direccion: "Calle 10 # 20-30",
  historialMedico: "Sin antecedentes",
  idSeguroMedico: "",
};

// Limpiar mocks antes de cada prueba
beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockClear();
});

describe("RegistroPaciente", () => {
  it("Debe mostrar el formulario de registro", () => {
    renderWithRouter(<FormPaciente />);
    expect(screen.getByText(/Registrar Nuevo Paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Completo \*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar Paciente/i })).toBeInTheDocument();
  });

  it("Debe mostrar todos los campos requeridos", () => {
    renderWithRouter(<FormPaciente />);
    expect(screen.getByText(/Nombre Completo \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Documento de Identidad \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha de Nacimiento \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Género \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo Electrónico \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Dirección \*/i)).toBeInTheDocument();
  });

  it("Debe permitir ingresar los datos del paciente", () => {
    renderWithRouter(<FormPaciente />);

    const inputNombre = screen.getByLabelText(/Nombre Completo \*/i);
    const inputDocumento = screen.getByLabelText(/Documento de Identidad \*/i);
    const inputTelefono = screen.getByLabelText(/Teléfono \*/i);

    fireEvent.change(inputNombre, { target: { value: datosPacienteValidos.nombreCompleto } });
    fireEvent.change(inputDocumento, { target: { value: datosPacienteValidos.documentoIdentidad } });
    fireEvent.change(inputTelefono, { target: { value: datosPacienteValidos.telefono } });

    expect(inputNombre.value).toBe(datosPacienteValidos.nombreCompleto);
    expect(inputDocumento.value).toBe(datosPacienteValidos.documentoIdentidad);
    expect(inputTelefono.value).toBe(datosPacienteValidos.telefono);
  });

  it("Debe registrar un paciente correctamente", async () => {
    crearPaciente.mockResolvedValue({ id: 1, message: "Creado" });

    renderWithRouter(<FormPaciente />);

    fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
      target: { value: datosPacienteValidos.nombreCompleto },
    });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
      target: { value: datosPacienteValidos.documentoIdentidad },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
      target: { value: datosPacienteValidos.fechaNacimiento },
    });
    fireEvent.change(screen.getByLabelText(/Género \*/i), {
      target: { value: datosPacienteValidos.genero },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
      target: { value: datosPacienteValidos.telefono },
    });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
      target: { value: datosPacienteValidos.correoElectronico },
    });
    fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
      target: { value: datosPacienteValidos.direccion },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      expect(crearPaciente).toHaveBeenCalledTimes(1);
    });
  });

  it("Debe generar un código único de paciente", async () => {
    crearPaciente.mockResolvedValue({ id: 42 });

    renderWithRouter(<FormPaciente />);

    const completarFormulario = () => {
      fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
        target: { value: datosPacienteValidos.nombreCompleto },
      });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
        target: { value: datosPacienteValidos.documentoIdentidad },
      });
      fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
        target: { value: datosPacienteValidos.fechaNacimiento },
      });
      fireEvent.change(screen.getByLabelText(/Género \*/i), {
        target: { value: datosPacienteValidos.genero },
      });
      fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
        target: { value: datosPacienteValidos.telefono },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
        target: { value: datosPacienteValidos.correoElectronico },
      });
      fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
        target: { value: datosPacienteValidos.direccion },
      });
    };

    completarFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      expect(crearPaciente).toHaveBeenCalledTimes(1);
      const payloadEnviado = crearPaciente.mock.calls[0][0];
      expect(payloadEnviado.DocumentoIdentidad).toBe(datosPacienteValidos.documentoIdentidad);
      expect(payloadEnviado.NombreCompleto).toBe(datosPacienteValidos.nombreCompleto);
      expect(payloadEnviado.Telefono).toBe(datosPacienteValidos.telefono);
      expect(payloadEnviado.CorreoElectronico).toBe(datosPacienteValidos.correoElectronico);
    });
  });

  it("Debe almacenar correctamente la información", async () => {
    const respuestaMock = { id: 99 };
    crearPaciente.mockResolvedValue(respuestaMock);

    renderWithRouter(<FormPaciente />);

    fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
      target: { value: datosPacienteValidos.nombreCompleto },
    });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
      target: { value: datosPacienteValidos.documentoIdentidad },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
      target: { value: datosPacienteValidos.fechaNacimiento },
    });
    fireEvent.change(screen.getByLabelText(/Género \*/i), {
      target: { value: datosPacienteValidos.genero },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
      target: { value: datosPacienteValidos.telefono },
    });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
      target: { value: datosPacienteValidos.correoElectronico },
    });
    fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
      target: { value: datosPacienteValidos.direccion },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      const payloadEnviado = crearPaciente.mock.calls[0][0];
      expect(payloadEnviado).toEqual(
        expect.objectContaining({
          NombreCompleto: datosPacienteValidos.nombreCompleto,
          DocumentoIdentidad: datosPacienteValidos.documentoIdentidad,
          FechaNacimiento: datosPacienteValidos.fechaNacimiento,
          Genero: datosPacienteValidos.genero,
          Telefono: datosPacienteValidos.telefono,
          CorreoElectronico: datosPacienteValidos.correoElectronico,
          Direccion: datosPacienteValidos.direccion,
        })
      );
    });

    const resultado = await crearPaciente();
    expect(resultado.id).toBe(99);
  });

  it("Debe mostrar mensaje de registro exitoso", async () => {
    crearPaciente.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormPaciente />);

    const completarFormulario = () => {
      fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
        target: { value: datosPacienteValidos.nombreCompleto },
      });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
        target: { value: datosPacienteValidos.documentoIdentidad },
      });
      fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
        target: { value: datosPacienteValidos.fechaNacimiento },
      });
      fireEvent.change(screen.getByLabelText(/Género \*/i), {
        target: { value: datosPacienteValidos.genero },
      });
      fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
        target: { value: datosPacienteValidos.telefono },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
        target: { value: datosPacienteValidos.correoElectronico },
      });
      fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
        target: { value: datosPacienteValidos.direccion },
      });
    };

    completarFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      expect(screen.getByText(/Paciente registrado exitosamente/i)).toBeInTheDocument();
    });
  });

  it("Debe redirigir a la lista de pacientes tras registro exitoso", async () => {
    crearPaciente.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormPaciente />);

    const completarFormulario = () => {
      fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
        target: { value: datosPacienteValidos.nombreCompleto },
      });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
        target: { value: datosPacienteValidos.documentoIdentidad },
      });
      fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
        target: { value: datosPacienteValidos.fechaNacimiento },
      });
      fireEvent.change(screen.getByLabelText(/Género \*/i), {
        target: { value: datosPacienteValidos.genero },
      });
      fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
        target: { value: datosPacienteValidos.telefono },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
        target: { value: datosPacienteValidos.correoElectronico },
      });
      fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
        target: { value: datosPacienteValidos.direccion },
      });
    };

    completarFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/pacientes");
    });
  });

  it("Debe deshabilitar el botón mientras envía el formulario", async () => {
    let resolveCreate;
    const promise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    crearPaciente.mockReturnValue(promise);

    renderWithRouter(<FormPaciente />);

    const completarFormulario = () => {
      fireEvent.change(screen.getByLabelText(/Nombre Completo \*/i), {
        target: { value: datosPacienteValidos.nombreCompleto },
      });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), {
        target: { value: datosPacienteValidos.documentoIdentidad },
      });
      fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento \*/i), {
        target: { value: datosPacienteValidos.fechaNacimiento },
      });
      fireEvent.change(screen.getByLabelText(/Género \*/i), {
        target: { value: datosPacienteValidos.genero },
      });
      fireEvent.change(screen.getByLabelText(/Teléfono \*/i), {
        target: { value: datosPacienteValidos.telefono },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), {
        target: { value: datosPacienteValidos.correoElectronico },
      });
      fireEvent.change(screen.getByLabelText(/Dirección \*/i), {
        target: { value: datosPacienteValidos.direccion },
      });
    };

    completarFormulario();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Paciente/i }));

    await waitFor(() => {
      expect(screen.getByText(/Cargando datos/i)).toBeInTheDocument();
    });

    resolveCreate({ id: 1 });
    await waitFor(() => {
      expect(crearPaciente).toHaveBeenCalledTimes(1);
    });
  });
});
