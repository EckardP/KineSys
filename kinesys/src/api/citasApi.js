// src/api/citasApi.js
import { crearApiCliente } from "./apiCliente";

//crearApiCliente es una función que recibe el nombre del recurso y devuelve un cliente API configurado para ese recurso.
export const citasApi = crearApiCliente('Citas');
