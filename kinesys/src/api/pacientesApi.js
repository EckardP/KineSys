// src/api/pacientesApi.js
import { crearApiCliente } from "./apiCliente";

// Usamos el endpoint de Personas, no de Pacientes
export default crearApiCliente('Personas');