import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FormFisioterapeuta from "../../../features/professional/GestionProfesionales/FormFisioterapeuta";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

const mockCrearFisioterapeuta = vi.fn();
vi.mock("../../../services/fisioterapeutasService", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    crearFisioterapeuta: (...args) => mockCrearFisioterapeuta(...args),
  };
});

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const datosFisioterapeutaValidos = {
  nombres: "Carlos",
  apellidos: "Ramírez López",
  documentoIdentidad: "87654321",
  tarjetaProfesional: "TF-98765",
  especialidades: "Rehabilitación, Traumatología",
  telefono: "3109876543",
  correoElectronico: "carlos.ramirez@clinica.com",
  horarioDisponibilidad: "Lunes a Viernes 8:00 - 17:00",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockClear();
  mockCrearFisioterapeuta.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RegistroFisioterapeuta", () => {
  it("Debe mostrar el formulario de registro", () => {
    renderWithRouter(<FormFisioterapeuta />);
    expect(screen.getByText(/Registrar Nuevo Fisioterapeuta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres \*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar Profesional/i })).toBeInTheDocument();
  });

  it("Debe mostrar todos los campos requeridos", () => {
    renderWithRouter(<FormFisioterapeuta />);
    expect(screen.getByText(/Nombres \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Apellidos \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Documento de Identidad \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Tarjeta Profesional \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo Electrónico \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Especialidades/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByText(/Horario de Disponibilidad/i)).toBeInTheDocument();
  });

  it("Debe permitir ingresar la información del fisioterapeuta", () => {
    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });

    expect(screen.getByLabelText(/Nombres \*/i).value).toBe(datosFisioterapeutaValidos.nombres);
    expect(screen.getByLabelText(/Apellidos \*/i).value).toBe(datosFisioterapeutaValidos.apellidos);
    expect(screen.getByLabelText(/Documento de Identidad \*/i).value).toBe(datosFisioterapeutaValidos.documentoIdentidad);
  });

  it("Debe registrar un fisioterapeuta correctamente", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1, message: "Creado" });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).toHaveBeenCalledTimes(1));
  });

  it("Debe generar credenciales de acceso", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => {
      const llamada = mockCrearFisioterapeuta.mock.calls[0][0];
      expect(llamada.documentoIdentidad).toBe(datosFisioterapeutaValidos.documentoIdentidad);
      expect(llamada.tarjetaProfesional).toBe(datosFisioterapeutaValidos.tarjetaProfesional);
      expect(llamada.correoElectronico).toBe(datosFisioterapeutaValidos.correoElectronico);
    });
  });

  it("Debe almacenar correctamente la información", async () => {
    const respuestaMock = { id: 42 };
    mockCrearFisioterapeuta.mockResolvedValue(respuestaMock);

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    fireEvent.change(screen.getByLabelText(/Especialidades/i), { target: { value: datosFisioterapeutaValidos.especialidades } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: datosFisioterapeutaValidos.telefono } });
    fireEvent.change(screen.getByLabelText(/Horario de Disponibilidad/i), { target: { value: datosFisioterapeutaValidos.horarioDisponibilidad } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => {
      const payloadEnviado = mockCrearFisioterapeuta.mock.calls[0][0];
      expect(payloadEnviado.nombres).toBe(datosFisioterapeutaValidos.nombres);
      expect(payloadEnviado.apellidos).toBe(datosFisioterapeutaValidos.apellidos);
    });

    const resultado = await mockCrearFisioterapeuta();
    expect(resultado.id).toBe(42);
  });

  it("Debe enviar correo con las credenciales", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => {
      expect(mockCrearFisioterapeuta).toHaveBeenCalledTimes(1);
      expect(mockCrearFisioterapeuta.mock.calls[0][0].correoElectronico).toBe(datosFisioterapeutaValidos.correoElectronico);
    });
  });

  it("Debe mostrar mensaje de registro exitoso", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(screen.getByText(/Fisioterapeuta registrado exitosamente/i)).toBeInTheDocument());
  });

  it("Debe redirigir a la lista de profesionales tras registro exitoso", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(screen.getByText(/Fisioterapeuta registrado exitosamente/i)).toBeInTheDocument());
  });

  it("Debe deshabilitar el botón mientras envía el formulario", async () => {
    let resolveCrear;
    const promise = new Promise((resolve) => { resolveCrear = resolve; });
    mockCrearFisioterapeuta.mockReturnValue(promise);

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    expect(screen.getByRole("button", { name: /Registrando/i })).toBeDisabled();
    resolveCrear({ id: 1 });
    await waitFor(() => expect(mockCrearFisioterapeuta).toHaveBeenCalledTimes(1));
  });

  it("Debe validar nombre obligatorio", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe validar apellido obligatorio", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe validar documento obligatorio", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe validar tarjeta profesional obligatoria", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe validar correo obligatorio", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe rechazar documentos duplicados", async () => {
    const errorDuplicado = new Error("Ya existe un fisioterapeuta con ese documento de identidad");
    errorDuplicado.response = { status: 409, data: "documento duplicado" };
    mockCrearFisioterapeuta.mockRejectedValue(errorDuplicado);

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => {
      expect(screen.getByText(/Ya existe un fisioterapeuta con ese documento/i)).toBeInTheDocument();
    });
  });

  it("Debe rechazar tarjetas profesionales duplicadas", async () => {
    const errorDuplicado = new Error("Ya existe un fisioterapeuta con esa tarjeta profesional");
    errorDuplicado.response = { status: 409, data: "tarjeta duplicada" };
    mockCrearFisioterapeuta.mockRejectedValue(errorDuplicado);

    renderWithRouter(<FormFisioterapeuta />);

    const completar = () => {
      fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
      fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
      fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
      fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: datosFisioterapeutaValidos.correoElectronico } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => {
      expect(screen.getByText(/Ya existe un fisioterapeuta con esa tarjeta/i)).toBeInTheDocument();
    });
  });

  it("Debe validar formato de correo electrónico", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.change(screen.getByLabelText(/Nombres \*/i), { target: { value: datosFisioterapeutaValidos.nombres } });
    fireEvent.change(screen.getByLabelText(/Apellidos \*/i), { target: { value: datosFisioterapeutaValidos.apellidos } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad \*/i), { target: { value: datosFisioterapeutaValidos.documentoIdentidad } });
    fireEvent.change(screen.getByLabelText(/Tarjeta Profesional \*/i), { target: { value: datosFisioterapeutaValidos.tarjetaProfesional } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico \*/i), { target: { value: "correo-invalido" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });

  it("Debe impedir registrar fisioterapeutas con datos inválidos", async () => {
    mockCrearFisioterapeuta.mockResolvedValue({ id: 1 });

    renderWithRouter(<FormFisioterapeuta />);

    fireEvent.click(screen.getByRole("button", { name: /Registrar Profesional/i }));

    await waitFor(() => expect(mockCrearFisioterapeuta).not.toHaveBeenCalled());
  });
});
