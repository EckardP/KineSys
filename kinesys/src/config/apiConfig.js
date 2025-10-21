// src/config/apiConfig.js

// Lee la URL base desde el archivo .env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Función auxiliar para componer URLs de endpoints
export const getEndpoint = (ruta) => `${API_BASE_URL}/${ruta}`;
