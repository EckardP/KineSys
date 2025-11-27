import { getEndpoint } from '../config/apiConfig';

// Variable global para almacenar el token actual
let tokenGlobal = null;

// Función para actualizar el token desde los componentes
export function setAuthToken(token) {
  tokenGlobal = token;
  console.log("🔐 Token actualizado en apiCliente:", token ? "SÍ" : "NO");
}

export function crearApiCliente(ruta) {
    const URL_BASE = getEndpoint(ruta);

    async function respuesta(url = "", opciones = {}) {
        // USAR PRIMERO EL TOKEN GLOBAL (del contexto) y luego buscar en sessionStorage
        const token = tokenGlobal || sessionStorage.getItem('authToken');
        
        console.log("🔐 Token para la solicitud:", token ? "PRESENTE" : "NO ENCONTRADO");

        const headers = {
            'Content-Type': 'application/json',
            ...opciones.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log("✅ Header Authorization agregado");
        } else {
            console.warn("⚠️ No se encontró token de autenticación");
        }

        console.log("🌐 URL de la solicitud:", `${URL_BASE}${url}`);

        try {
            const respuesta = await fetch(`${URL_BASE}${url}`, {
                headers,
                credentials: 'include',
                ...opciones,
            });
            
            if (!respuesta.ok) {
                // Si es error 401, limpiar token
                if (respuesta.status === 401) {
                    tokenGlobal = null;
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('usuario');
                    console.warn("🔐 Token expirado o inválido - Limpiado del sessionStorage");
                    
                    // Disparar evento global para que los componentes sepan
                    window.dispatchEvent(new Event('auth-token-expired'));
                }
                
                const msg = await respuesta.text();
                throw new Error(`Error en la solicitud: ${respuesta.status} ${msg || "Error en la API"}`);
            }
            
            if (respuesta.status !== 204) {
                return await respuesta.json();
            }
            
            return null;
        } catch (error) {
            console.error("❌ Error en fetch:", error);
            throw error;
        }
    }

    return {
        getAll: () => respuesta(),
        getAllCustom: (endpointPersonalizado = "") => respuesta(endpointPersonalizado),
        getById: (id) => respuesta(`/${id}`),
        create: (endpointPersonalizado = "", data) => respuesta(endpointPersonalizado, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (url, data) => respuesta(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => respuesta(`/${id}`, {
            method: 'DELETE'
        }),
        customRequest: (url, opciones = {}) => respuesta(url, opciones)
    };
}

/**
 * Utilidad para decodificar tokens JWT y extraer datos del usuario
 */

/**
 * Decodifica un token JWT (solo la parte del payload)
 * @param {string} token - El token JWT
 * @returns {object} - El payload decodificado
 */
export function decodificarToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

/**
 * Extrae los datos del usuario del token JWT generado por ASP.NET
 * @param {string} token - El token JWT
 * @returns {object} - Objeto con los datos del usuario
 */
export function extraerDatosUsuario(token) {
  const payload = decodificarToken(token);
  
  if (!payload) {
    return null;
  }

  console.log('Payload completo del token:', payload); // Para debug

  // Los claims de ASP.NET usan URLs completas, necesitamos mapearlos correctamente
  return {
    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
        payload.nameid || 
        payload.sub,
    
    usuario: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
             payload.unique_name || 
             payload.name,
    
    // ESTA ES LA CLAVE - El FullName está en un claim personalizado sin namespace
    nombreCompleto: payload.FullName || 
                   `${payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']} ${payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']}`,
    
    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
           payload.email,
    
    rol: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
          payload.role,
    
    exp: payload.exp
  };
}

/**
 * Verifica si un token ha expirado
 * @param {string} token - El token JWT
 * @returns {boolean} - True si el token ha expirado
 */
export function tokenExpirado(token) {
  const payload = decodificarToken(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const ahora = Date.now() / 1000;
  return payload.exp < ahora;
}