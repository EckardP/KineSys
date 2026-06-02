const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const outDir = path.join(root, "artifacts", "documentos", "primera-entrega");
fs.mkdirSync(outDir, { recursive: true });

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function p(text, cls = "") {
  return `<p${cls ? ` class="${cls}"` : ""}>${esc(text)}</p>`;
}

function ul(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function ol(items) {
  return `<ol>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>`;
}

function table(headers, rows, cls = "") {
  return `<table${cls ? ` class="${cls}"` : ""}>
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table>`;
}

function code(text) {
  return `<pre><code>${esc(text)}</code></pre>`;
}

function callout(title, text) {
  return `<div class="callout"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`;
}

function pageBreak() {
  return `<div class="page-break"></div>`;
}

const modules = [
  {
    name: "Registro y Gestión de Pacientes",
    id: "PAC",
    description:
      "Módulo encargado de registrar, consultar, actualizar y eliminar pacientes. Gestiona datos personales, documento, contacto, EPS, seguro médico, afiliación y rol Paciente.",
    files:
      "PatientForm.jsx, PatientList.jsx, pacientesService.js, pacientesApi.js, Paciente.cs, PersonasController/PacientesController.",
  },
  {
    name: "Registro y Gestión de Terapeutas",
    id: "TER",
    description:
      "Módulo encargado de registrar, consultar, actualizar y eliminar terapeutas. Administra información personal, acceso, contacto, licencia profesional, título académico, años de experiencia, fecha de contratación, estado y especialidades.",
    files:
      "TerapeutaForm.jsx, TerapeutasList.jsx, terapeutasService.js, terapeutasApi.js, Terapeuta.cs, PersonasController/TerapeutasController.",
  },
  {
    name: "Gestión de Terapias y Tratamientos",
    id: "TRA",
    description:
      "Módulo encargado de registrar, consultar, actualizar y eliminar tratamientos. Maneja nombre, descripción, especialidad, duración, costo, sesiones recomendadas, frecuencia, estado, indicaciones, contraindicaciones y equipos requeridos.",
    files:
      "TratamientoForm.jsx, TratamientosList.jsx, tratamientosService.js, tratamientosApi.js, Tratamiento.cs, TratamientoesController.",
  },
];

const functionalReqs = [
  ["RF-PAC-01", "Pacientes", "Registrar pacientes con datos personales, documento, contacto, EPS, seguro y rol Paciente."],
  ["RF-PAC-02", "Pacientes", "Listar únicamente personas con rol Paciente (rol = 1)."],
  ["RF-PAC-03", "Pacientes", "Consultar un paciente por identificador y rechazar registros que no tengan rol Paciente."],
  ["RF-PAC-04", "Pacientes", "Actualizar datos del paciente mediante endpoint /Update/{id}."],
  ["RF-PAC-05", "Pacientes", "Eliminar paciente por identificador propagando errores funcionales del API."],
  ["RF-TER-01", "Terapeutas", "Registrar terapeutas con rol Terapeuta (rol = 2), datos de acceso y datos profesionales."],
  ["RF-TER-02", "Terapeutas", "Listar únicamente personas con rol Terapeuta (rol = 2)."],
  ["RF-TER-03", "Terapeutas", "Consultar un terapeuta por identificador y rechazar registros que no tengan rol Terapeuta."],
  ["RF-TER-04", "Terapeutas", "Actualizar terapeuta preservando rol 2 y normalizando datos profesionales."],
  ["RF-TER-05", "Terapeutas", "Obtener únicamente terapeutas activos."],
  ["RF-TRA-01", "Tratamientos", "Registrar tratamientos asociados a una especialidad válida."],
  ["RF-TRA-02", "Tratamientos", "Listar, consultar, actualizar y eliminar tratamientos."],
  ["RF-TRA-03", "Tratamientos", "Validar nombre obligatorio, especialidad, duración, sesiones, costo y frecuencia."],
  ["RF-TRA-04", "Tratamientos", "Agregar y remover equipos requeridos para un tratamiento mediante rutas anidadas."],
  ["RF-TRA-05", "Tratamientos", "Advertir cuando la cantidad de equipo solicitada supera la disponibilidad real."],
];

const nonFunctionalReqs = [
  ["RNF-01", "Mantenibilidad", "Cada módulo separa UI, servicio y API client para facilitar pruebas y cambios controlados."],
  ["RNF-02", "Seguridad", "Las operaciones se ejecutan bajo sesión autenticada; el token JWT lo agrega apiCliente mediante Authorization Bearer."],
  ["RNF-03", "Integridad", "Paciente y Terapeuta se distinguen por rol; Tratamiento exige especialidad válida y relaciones con equipos."],
  ["RNF-04", "Usabilidad", "Formularios con campos requeridos, listas, búsquedas, estados de carga y mensajes de error."],
  ["RNF-05", "Portabilidad", "Frontend React/Vite ejecutable en navegador moderno; API .NET 8 con SQL Server."],
  ["RNF-06", "Testabilidad", "Servicios principales cubiertos con Vitest/Jest, mocks de APIs y salidas de ejecución guardadas."],
];

const useCases = [
  ["CU-PAC-01", "Administrador", "Registrar paciente", "Formulario con datos válidos", "Paciente creado con rol 1 y credenciales iniciales por documento."],
  ["CU-PAC-02", "Administrador", "Actualizar paciente", "Paciente existente", "Datos actualizados en backend."],
  ["CU-PAC-03", "Administrador", "Eliminar paciente", "Paciente seleccionado", "Paciente eliminado o error mostrado si la operación falla."],
  ["CU-TER-01", "Administrador", "Registrar terapeuta", "Formulario con datos personales y profesionales válidos", "Terapeuta creado con rol 2 y activo."],
  ["CU-TER-02", "Administrador", "Actualizar terapeuta", "Terapeuta existente", "Datos actualizados preservando rol Terapeuta."],
  ["CU-TER-03", "Administrador", "Listar terapeutas activos", "Personas cargadas desde API", "Se muestran solo terapeutas activos."],
  ["CU-TRA-01", "Administrador", "Registrar tratamiento", "Especialidad seleccionada y datos válidos", "Tratamiento creado con configuración clínica y económica."],
  ["CU-TRA-02", "Administrador", "Agregar equipo a tratamiento", "Equipo y cantidad seleccionados", "Equipo asociado al tratamiento o advertencia por exceso."],
  ["CU-TRA-03", "Administrador", "Eliminar tratamiento", "Tratamiento seleccionado", "Tratamiento eliminado o error mostrado si está relacionado."],
];

const designRows = [
  ["Paciente", "Persona", "Hereda datos comunes y agrega EPS, seguro, afiliación, estado clínico, citas, tratamientos e historial."],
  ["Terapeuta", "Persona", "Hereda datos comunes y agrega licencia, título, experiencia, contratación, citas, disponibilidad y especialidades."],
  ["Tratamiento", "Entidad clínica", "Se relaciona con terapeuta, paciente/planes, protocolos, tipos de terapia y equipos requeridos."],
  ["pacientesService", "Servicio frontend", "Filtra rol 1, crea con /Register, actualiza con /Update/{id}, elimina por id."],
  ["terapeutasService", "Servicio frontend", "Filtra rol 2, crea con /Register, preserva rol 2 al actualizar y obtiene activos."],
  ["tratamientosService", "Servicio frontend", "CRUD de tratamientos y rutas /{idTratamiento}/equipos para equipos requeridos."],
];

const scopeRows = [
  ["Pacientes", "Registro, consulta, edición, eliminación y validación de rol Paciente"],
  ["Terapeutas", "Registro, consulta, edición, eliminación, activos y validación de rol Terapeuta"],
  ["Tratamientos", "Registro, consulta, edición, eliminación, especialidad, duración, costo, sesiones y equipos requeridos"],
];

const strategyRows = [
  ["Unitarias", "Caja negra y caja blanca", "Clases de equivalencia, valores límite, caminos básicos y mocks de API", "Vitest, Jest"],
  ["Integración", "Incremental", "Formulario -> servicio -> API client -> endpoint; validación de rol y payload", "Vitest/Jest, revisión de código"],
  ["Sistema", "Caja negra", "Build de producción y revisión de comportamiento por módulo", "Vite build"],
  ["Aceptación", "Caja negra", "Escenarios funcionales por módulo con pasos de negocio", "Manual; pendiente Selenium/Katalon"],
];

const hardwareRows = [
  ["Equipo de pruebas", "Windows 11 Home Single Language 64 bits, Intel Core i5-1235U, 10 núcleos, 12 procesadores lógicos, 15.7 GB RAM"],
  ["Repositorio", "C:\\Users\\carde\\Documents\\ProgramacionMovil\\KineSys"],
];

const softwareRows = [
  ["Node.js", "v24.14.0"],
  ["npm", "11.9.0"],
  ["React", "19.1.1"],
  ["Vite", "7.x; build ejecutado correctamente"],
  ["Vitest", "4.1.5"],
  ["Jest", "30.3.0"],
  ["Testing Library React", "16.3.2"],
  [".NET", "API objetivo net8.0; SDK local 10.0.103"],
  ["SQL Server", "Configurado en docker-compose.yml"],
];

const automatedRows = [
  ["pacientesService.test.js", "Pacientes", "12", "listar, obtener, crear, actualizar, eliminar, errores de API", "Aprobado"],
  ["terapeutasService.test.js", "Terapeutas", "12", "listar, obtener, crear, actualizar, eliminar, activos", "Aprobado"],
  ["tratamientosService.test.js", "Tratamientos", "9", "listar, obtener, crear, actualizar, eliminar, equipos, error 409", "Aprobado"],
];

const coverageRows = [
  ["Suite completa frontend", "71.83%", "70.70%", "76.66%", "71.75%"],
  ["pacientesService.js", "79.31%", "33.33%", "100.00%", "78.57%"],
  ["terapeutasService.js", "60.97%", "71.42%", "80.00%", "58.97%"],
  ["tratamientosService.js", "74.41%", "50.00%", "100.00%", "74.41%"],
];

const pacienteEquivalence = [
  ["Nombres", "2 a 50 caracteres, solo letras y espacios", "Vacío, menor a 2, mayor a 50, contiene números"],
  ["Apellidos", "2 a 50 caracteres, solo letras y espacios", "Vacío, mayor a 50, contiene números"],
  ["Tipo documento", "CC, TI, CE, PA", "Sin selección o valor no permitido"],
  ["Documento identidad", "6 a 15 dígitos", "Vacío, menor a 6, mayor a 15, contiene letras"],
  ["Correo", "Formato usuario@dominio", "Sin @, sin dominio, vacío si obligatorio"],
  ["Teléfono/Celular", "10 dígitos numéricos", "Menor a 10, mayor a 10, contiene letras"],
  ["Fecha nacimiento", "Fecha válida pasada", "Fecha futura, formato inválido"],
  ["EPS/Seguro", "Registro existente o vacío permitido según flujo", "ID inexistente o afiliación incompleta cuando se selecciona EPS"],
];

const terapeutaEquivalence = [
  ["Usuario", "4 a 20 caracteres alfanuméricos", "Vacío, menor a 4, mayor a 20, caracteres especiales"],
  ["Contraseña", "Mínimo 6 caracteres en creación", "Vacía en creación, menor a 6"],
  ["Documento identidad", "6 a 15 dígitos", "Vacío, fuera de rango, contiene letras"],
  ["Nombres/Apellidos", "2 a 50 caracteres", "Vacío, menor a 2, mayor a 50, caracteres inválidos"],
  ["Licencia profesional", "Texto no vacío", "Vacía o duplicada"],
  ["Título académico", "Texto no vacío", "Vacío o demasiado corto"],
  ["Años experiencia", "0 a 99", "Negativo, mayor a 99, texto"],
  ["Fecha contratación", "Fecha válida", "Formato inválido"],
];

const tratamientoEquivalence = [
  ["Nombre", "Texto no vacío", "Vacío o solo espacios"],
  ["Especialidad", "ID diferente de 0 y existente", "0, vacío o especialidad inexistente"],
  ["Duración", "5 a 240 minutos", "Menor a 5, mayor a 240, no numérico"],
  ["Costo base", "Mayor o igual a 0", "Negativo o no numérico"],
  ["Sesiones recomendadas", "1 a 50", "0, negativo, mayor a 50"],
  ["Frecuencia", "Diaria, Semanal, Quincenal, Mensual", "Valor diferente a los permitidos"],
  ["Equipos", "Equipo existente y cantidad mayor o igual a 1", "Sin equipo, cantidad 0 o mayor a disponibilidad sin confirmación"],
];

const pacienteCases = [
  ["PAC-CP01", "Datos completos válidos", "Ana Pérez, CC, 12345678, correo válido", "Registro exitoso", "Aprobado por servicio"],
  ["PAC-CP02", "Nombre vacío", "nombres = ''", "Formulario bloquea y muestra alerta", "Diseñado"],
  ["PAC-CP03", "Documento corto", "12345", "Error de validación", "Diseñado"],
  ["PAC-CP04", "Persona con rol distinto", "API devuelve rol 2", "obtenerPaciente lanza error", "Automatizado aprobado"],
  ["PAC-CP05", "API sin pacientes", "Lista con roles 2 y 3", "listarPacientes devuelve []", "Automatizado aprobado"],
  ["PAC-CP06", "Error de eliminación", "API rechaza delete", "Error propagado", "Automatizado aprobado"],
];

const terapeutaCases = [
  ["TER-CP01", "Datos válidos", "usuario, password, documento, licencia y título", "Registro exitoso con rol 2", "Aprobado por servicio"],
  ["TER-CP02", "Contraseña vacía en creación", "password = ''", "Formulario bloquea", "Diseñado"],
  ["TER-CP03", "Campos profesionales vacíos", "noLicencia/tituloAcademico vacíos", "Formulario bloquea", "Diseñado"],
  ["TER-CP04", "Persona con rol distinto", "API devuelve rol 1", "obtenerTerapeuta lanza error", "Automatizado aprobado"],
  ["TER-CP05", "Actualizar terapeuta", "datos parciales", "Se preserva rol 2", "Automatizado aprobado"],
  ["TER-CP06", "Listar activos", "mezcla activo true/false", "Devuelve solo terapeutas activos", "Automatizado aprobado"],
];

const tratamientoCases = [
  ["TRA-CP01", "Datos válidos", "nombre, especialidad 1, duración 60, costo 150000", "Tratamiento creado", "Automatizado servicio"],
  ["TRA-CP02", "Nombre vacío", "nombre = ''", "Formulario bloquea", "Diseñado"],
  ["TRA-CP03", "Especialidad no seleccionada", "idEspecialidad = 0", "Muestra error de especialidad", "Diseñado"],
  ["TRA-CP04", "Duración menor a 5", "duracionMinutos = 4", "Input no permite / error", "Diseñado"],
  ["TRA-CP05", "Costo negativo", "costoBase = -1", "Input no permite / error", "Diseñado"],
  ["TRA-CP06", "Tratamiento duplicado", "API responde 409", "Mensaje: Ya existe un tratamiento con ese nombre", "Automatizado aprobado"],
  ["TRA-CP07", "Agregar equipo", "idTratamiento 9, idEquipo 2", "POST /9/equipos", "Automatizado aprobado"],
  ["TRA-CP08", "Remover equipo", "idTratamiento 9, idEquipo 2", "DELETE /9/equipos/2", "Automatizado aprobado"],
];

const boundaryRows = [
  ["Paciente", "Documento", "5 dígitos", "Límite inferior -1", "Error"],
  ["Paciente", "Documento", "6 dígitos", "Límite inferior exacto", "OK"],
  ["Paciente", "Documento", "15 dígitos", "Límite superior exacto", "OK"],
  ["Paciente", "Documento", "16 dígitos", "Límite superior +1", "Error"],
  ["Terapeuta", "Usuario", "3 caracteres", "Límite inferior -1", "Error"],
  ["Terapeuta", "Usuario", "4 caracteres", "Límite inferior exacto", "OK"],
  ["Terapeuta", "Contraseña", "5 caracteres", "Límite inferior -1", "Error"],
  ["Terapeuta", "Contraseña", "6 caracteres", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Duración", "4", "Límite inferior -1", "Error"],
  ["Tratamiento", "Duración", "5", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Duración", "240", "Límite superior exacto", "OK"],
  ["Tratamiento", "Duración", "241", "Límite superior +1", "Error"],
  ["Tratamiento", "Sesiones", "0", "Límite inferior -1", "Error"],
  ["Tratamiento", "Sesiones", "1", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Sesiones", "50", "Límite superior exacto", "OK"],
  ["Tratamiento", "Sesiones", "51", "Límite superior +1", "Error"],
  ["Tratamiento", "Costo", "-1", "Límite inferior -1", "Error"],
  ["Tratamiento", "Costo", "0", "Límite inferior exacto", "OK"],
];

const basicPaths = [
  ["PAC-C1", "Crear paciente exitoso", "Formulario válido -> crearPaciente -> /Register -> respuesta OK", "Paciente guardado y lista recargada"],
  ["PAC-C2", "Paciente duplicado", "Formulario válido -> /Register -> 409", "Mensaje de documento duplicado"],
  ["PAC-C3", "Consultar no paciente", "obtenerPaciente -> API rol 2", "Error: no es un paciente"],
  ["TER-C1", "Crear terapeuta exitoso", "Formulario válido -> crearTerapeuta -> /Register -> respuesta OK", "Terapeuta guardado con rol 2"],
  ["TER-C2", "Editar terapeuta", "Formulario edición -> actualizarTerapeuta -> /Update/{id}", "Terapeuta actualizado preservando rol 2"],
  ["TER-C3", "Consultar no terapeuta", "obtenerTerapeuta -> API rol 1", "Error: no es un terapeuta"],
  ["TRA-C1", "Crear tratamiento exitoso", "Formulario válido -> crearTratamiento -> endpoint base", "Tratamiento guardado"],
  ["TRA-C2", "Especialidad inválida", "Formulario idEspecialidad = 0", "No se envía; se muestra error"],
  ["TRA-C3", "Equipo excede disponibilidad", "Cantidad requerida > disponible", "Sistema pide confirmación antes de continuar"],
  ["TRA-C4", "Tratamiento duplicado", "crearTratamiento -> 409", "Mensaje funcional de duplicado"],
];

const integrationRows = [
  ["INT-PAC-01", "PatientForm -> pacientesService -> pacientesApi", "Datos válidos", "Payload incluye user/password igual a documento, activo true y fechaRegistro", "Automatizado en servicio"],
  ["INT-PAC-02", "PatientList -> listarPacientes", "API retorna mezcla de roles", "Solo rol 1 aparece como paciente", "Automatizado"],
  ["INT-TER-01", "TerapeutaForm -> terapeutasService -> terapeutasApi", "Datos válidos", "Payload preserva rol 2, activo true y fechaRegistro", "Automatizado en servicio"],
  ["INT-TER-02", "TerapeutasList -> obtenerTerapeutasActivos", "Terapeutas activos/inactivos", "Solo activo true", "Automatizado"],
  ["INT-TRA-01", "TratamientoForm -> tratamientosService", "Datos válidos", "Crea/actualiza tratamiento con especialidad, duración, costo, frecuencia y equipos", "Automatizado parcial"],
  ["INT-TRA-02", "TratamientoForm -> listarEquipos/listarTratamientos", "Equipo seleccionado", "Calcula disponibilidad real según equipos ya usados", "Diseñado/revisión de código"],
  ["INT-TRA-03", "TratamientosList -> listarTratamientos/listarEspecialidades", "Carga de pantalla", "Muestra tabla, métricas y buscador por nombre/descripción/especialidad", "Diseñado/revisión de código"],
];

const systemRows = [
  ["Rendimiento", "Carga y construcción de los tres módulos", "npm run build", "Build exitoso; advertencia general por chunk JS grande"],
  ["Seguridad", "Operaciones CRUD bajo cliente API autenticado", "apiCliente + token JWT", "Authorization Bearer centralizado; requiere sesión válida"],
  ["Usabilidad", "Formularios de pacientes, terapeutas y tratamientos", "Revisión funcional", "Campos requeridos, mensajes y estados de carga documentados"],
  ["Portabilidad", "Ejecución frontend en ambiente local", "Node/Vite/Windows", "Pruebas y build ejecutados correctamente"],
];

const acceptanceRows = [
  ["CA-PAC-01", "RF-PAC-01", "Registrar paciente", "Completar formulario de paciente con datos válidos y guardar", "Paciente creado con rol 1", "Cubierto por servicio; UI pendiente manual"],
  ["CA-PAC-02", "RF-PAC-02", "Listar pacientes", "Abrir módulo de pacientes", "Solo se observan personas con rol Paciente", "Automatizado"],
  ["CA-TER-01", "RF-TER-01", "Registrar terapeuta", "Completar acceso, personal, contacto y profesional", "Terapeuta creado con rol 2", "Cubierto por servicio; UI pendiente manual"],
  ["CA-TER-02", "RF-TER-05", "Consultar terapeutas activos", "Abrir listado con mezcla de estados", "Solo activos en filtro correspondiente", "Automatizado"],
  ["CA-TRA-01", "RF-TRA-01", "Registrar tratamiento", "Completar nombre, especialidad, duración, costo y guardar", "Tratamiento creado", "Cubierto por servicio; UI pendiente manual"],
  ["CA-TRA-02", "RF-TRA-04", "Asociar equipo", "Seleccionar equipo y cantidad", "Equipo asociado a tratamiento", "Automatizado servicio"],
  ["CA-TRA-03", "RF-TRA-05", "Cantidad mayor a disponible", "Ingresar cantidad superior a disponibilidad real", "Sistema advierte y solicita confirmación", "Diseñado"],
];

const pendingRows = [
  ["Pantallazos de los tres módulos", "No se levantó servidor visual durante esta corrección", "Queda estructura lista para insertar capturas"],
  ["Diagramas gráficos UML", "No existen imágenes editables en el repositorio", "Se dejan casos de uso, componentes y relaciones en tablas"],
  ["Pruebas E2E Selenium/Katalon", "No están configuradas", "Casos de aceptación diseñados por módulo"],
  ["JMeter/OWASP ZAP", "No instalados", "Se documenta build, seguridad de cliente API y pruebas unitarias/integración"],
];

const moduleCards = modules
  .map(
    (m) => `<div class="module-card">
      <h4>${esc(m.name)}</h4>
      <p>${esc(m.description)}</p>
      <p class="note"><strong>Archivos:</strong> ${esc(m.files)}</p>
    </div>`
  )
  .join("");

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>KineSys - Proyecto Final Primera Entrega - Tres Módulos</title>
  <style>
    @page { size: A4; margin: 15mm 13mm 17mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #20262e;
      background: #fff;
      font-size: 9.8pt;
      line-height: 1.38;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4 { color: #17324d; margin: 0 0 7px; line-height: 1.18; }
    h1 { font-size: 25pt; }
    h2 { font-size: 16pt; margin-top: 17px; padding-bottom: 4px; border-bottom: 2px solid #3c8192; }
    h3 { font-size: 12.4pt; margin-top: 13px; color: #24586b; }
    h4 { font-size: 10.6pt; margin-top: 10px; color: #2f3d4a; }
    p { margin: 0 0 7px; }
    ul, ol { margin: 4px 0 9px 20px; padding: 0; }
    li { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin: 7px 0 12px; page-break-inside: avoid; }
    th { background: #e6f1f4; color: #17324d; font-weight: 700; }
    th, td { border: 1px solid #b7c7cf; padding: 4px 5px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafb; }
    pre {
      white-space: pre-wrap;
      background: #f2f5f7;
      border: 1px solid #cfd9df;
      border-radius: 4px;
      padding: 7px;
      font-size: 8.4pt;
      margin: 7px 0 11px;
    }
    .cover {
      min-height: 262mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      border: 3px solid #17324d;
      padding: 22mm 17mm;
    }
    .cover .kicker { text-transform: uppercase; letter-spacing: 1px; color: #4c6f79; font-weight: 700; }
    .cover h1 { font-size: 28pt; margin: 12px 0 14px; }
    .cover h2 { border: 0; font-size: 15pt; margin: 0 0 17px; color: #24586b; }
    .block { margin-top: 15px; }
    .page-break { break-before: page; page-break-before: always; }
    .toc { columns: 2; column-gap: 18px; }
    .toc p { margin-bottom: 3px; }
    .note { color: #52626c; font-size: 8.8pt; }
    .badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0 13px; }
    .badge { border: 1px solid #b7c7cf; background: #f4f9fa; border-radius: 5px; padding: 8px; text-align: center; min-height: 48px; }
    .badge strong { display: block; color: #17324d; font-size: 14pt; }
    .module-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 8px 0 12px; }
    .module-card { border: 1px solid #b7c7cf; border-left: 4px solid #3c8192; border-radius: 5px; padding: 8px 10px; background: #fbfdfd; page-break-inside: avoid; }
    .callout { border-left: 4px solid #3c8192; background: #f2f8fa; padding: 8px 10px; margin: 9px 0 12px; page-break-inside: avoid; }
    .callout p { margin: 3px 0 0; }
    .diagram { display: grid; grid-template-columns: 1fr 22px 1fr 22px 1fr; align-items: center; gap: 6px; margin: 8px 0 13px; page-break-inside: avoid; }
    .box { border: 1px solid #9cb7c2; background: #f7fbfc; border-radius: 5px; padding: 7px; text-align: center; min-height: 45px; }
    .arrow { text-align: center; color: #24586b; font-weight: 700; }
    .small td, .small th { font-size: 8.7pt; padding: 4px; }
  </style>
</head>
<body>
  <section class="cover">
    <div class="kicker">Proyecto final - primera entrega</div>
    <h1>KineSys</h1>
    <h2>Documento enfocado en los 3 módulos trabajados</h2>
    <p><strong>Pacientes - Terapeutas - Terapias y Tratamientos</strong></p>
    <div class="block">
      <p><strong>Estudiantes:</strong></p>
      <p>Eckard Antony Rodriguez Gutierrez</p>
      <p>Luis Alejandro Narvaez Teran</p>
    </div>
    <div class="block">
      <p><strong>Docente:</strong> Maribel Romero Mestre</p>
      <p>Universidad Popular del Cesar - Sede Sabanas</p>
      <p>Ingeniería de Sistemas</p>
      <p>Valledupar - Cesar</p>
      <p>2026</p>
    </div>
    <p class="note block">Versión corregida el 26 de abril de 2026. Se limita a los tres módulos que venían desarrollados en el PDF original y agrega las pruebas automatizadas correspondientes.</p>
  </section>

  ${pageBreak()}
  <h2>Tabla De Contenido</h2>
  <div class="toc">
    <p>1. Descripción del sistema para los tres módulos</p>
    <p>1.1 Identificación del problema</p>
    <p>1.2 Descripción de los módulos</p>
    <p>1.3 Requisitos funcionales y no funcionales</p>
    <p>1.4 Casos de uso</p>
    <p>1.5 Diseño del sistema</p>
    <p>1.6 Producto del software</p>
    <p>2. Pruebas del software</p>
    <p>2.1 Introducción</p>
    <p>2.2 Planificación</p>
    <p>2.3 Pruebas unitarias por módulo</p>
    <p>2.4 Pruebas de integración</p>
    <p>2.5 Pruebas de sistema</p>
    <p>2.6 Pruebas de aceptación</p>
    <p>3. Conclusiones</p>
    <p>4. Referencias y pendientes</p>
  </div>

  ${pageBreak()}
  <h2>1. Descripción Del Sistema Para Los Tres Módulos</h2>
  <h3>1.1 Identificación Del Problema</h3>
  ${p("La clínica de fisioterapia necesita controlar tres procesos centrales: el registro de pacientes, el registro de terapeutas y la gestión de terapias/tratamientos disponibles. Si estos procesos se gestionan manualmente, se producen errores de digitación, duplicidad de documentos, terapeutas sin información profesional completa, tratamientos sin especialidad definida y dificultad para relacionar equipos con terapias.")}
  ${p("El alcance de esta entrega se concentra únicamente en esos tres módulos, porque son los módulos que venían desarrollados en el PDF original y sobre los que se diseñan clases de equivalencia, valores límite, caminos básicos, pruebas unitarias, integración y aceptación.")}

  <h3>1.2 Descripción De Los Módulos</h3>
  <div class="module-grid">${moduleCards}</div>
  <div class="diagram">
    <div class="box"><strong>Formulario/Listado</strong><br>React</div>
    <div class="arrow">-&gt;</div>
    <div class="box"><strong>Servicio</strong><br>pacientesService<br>terapeutasService<br>tratamientosService</div>
    <div class="arrow">-&gt;</div>
    <div class="box"><strong>API</strong><br>ASP.NET Core<br>SQL Server</div>
  </div>

  <h3>1.3 Modelo De Requerimientos</h3>
  <h4>Requisitos Funcionales</h4>
  ${table(["ID", "Módulo", "Descripción"], functionalReqs, "small")}
  <h4>Requisitos No Funcionales</h4>
  ${table(["ID", "Atributo", "Descripción"], nonFunctionalReqs)}

  <h3>1.4 Modelo De Casos De Uso</h3>
  ${p("Actor principal para los tres módulos: Administrador. Los módulos se usan desde el panel administrativo para mantener la información base de la clínica.")}
  ${table(["ID", "Actor", "Caso de uso", "Precondición", "Resultado esperado"], useCases, "small")}

  <h3>1.5 Modelo De Diseño Del Sistema</h3>
  ${table(["Elemento", "Tipo", "Responsabilidad"], designRows)}

  <h3>1.6 Producto Del Software</h3>
  ${table(["Elemento", "Detalle"], [
    ["Aplicación", "KineSys - Sistema de Gestión de Clínica de Fisioterapia"],
    ["Módulos incluidos en este documento", "Pacientes, Terapeutas, Terapias/Tratamientos"],
    ["Frontend", "cd kinesys; npm run dev"],
    ["Pruebas", "cd kinesys; npm run test / npm run test:jest / npm run test:coverage"],
    ["Build", "cd kinesys; npm run build"],
    ["Backend", "cd api/ApiPrueba; dotnet run"],
  ])}

  ${pageBreak()}
  <h2>2. Pruebas Del Software</h2>
  <h3>2.1 Introducción</h3>
  ${p("Esta sección completa la plantilla de pruebas exclusivamente para los tres módulos trabajados: pacientes, terapeutas y tratamientos. Se incluyen técnicas de caja negra y caja blanca, diseño de casos, ejecución automatizada con Jest/Vitest y evaluación de resultados.")}
  <div class="badge-grid">
    <div class="badge"><strong>3</strong>Módulos evaluados</div>
    <div class="badge"><strong>33</strong>Pruebas específicas</div>
    <div class="badge"><strong>107</strong>Pruebas frontend totales</div>
    <div class="badge"><strong>10/10</strong>Suites aprobadas</div>
  </div>

  <h3>2.2 Planificación De Las Pruebas</h3>
  <h4>Objetivo General</h4>
  ${p("Verificar y validar que los módulos de Pacientes, Terapeutas y Terapias/Tratamientos permiten registrar, consultar, actualizar y eliminar información de forma consistente, con validación de datos, roles correctos y comunicación adecuada con los servicios/API.")}
  <h4>Objetivos Específicos</h4>
  ${ul([
    "Verificar que el módulo de Pacientes filtre rol 1, cree credenciales iniciales por documento y propague errores del API.",
    "Validar que el módulo de Terapeutas filtre rol 2, preserve el rol al actualizar y maneje datos profesionales obligatorios.",
    "Comprobar que el módulo de Tratamientos valide especialidad, duración, costo, sesiones, frecuencia y equipos asociados.",
    "Ejecutar pruebas unitarias automatizadas con Vitest y Jest para los servicios de los tres módulos.",
    "Diseñar casos de aceptación que permitan ejecutar manualmente los flujos de interfaz pendientes."
  ])}
  <h4>Alcance</h4>
  ${table(["Módulo", "Funcionalidades sometidas a prueba"], scopeRows)}
  <h4>Estrategia</h4>
  ${table(["Nivel", "Técnica", "Modelo / tipo", "Herramienta"], strategyRows)}
  <h4>Ambiente</h4>
  ${table(["Equipo", "Especificación"], hardwareRows)}
  ${table(["Software", "Versión / Estado"], softwareRows)}

  <h3>2.3 Pruebas Unitarias Por Módulo</h3>
  <h4>Resumen De Pruebas Automatizadas</h4>
  ${table(["Archivo", "Módulo", "Casos", "Cobertura funcional", "Resultado"], automatedRows)}
  ${table(["Área", "Sentencias", "Ramas", "Funciones", "Líneas"], coverageRows)}

  <h4>2.3.1 Módulo Pacientes - Clases De Equivalencia</h4>
  ${table(["Campo", "Clases válidas", "Clases inválidas"], pacienteEquivalence)}
  <h4>Casos De Prueba - Pacientes</h4>
  ${table(["ID", "Caso", "Datos", "Resultado esperado", "Resultado obtenido"], pacienteCases, "small")}

  <h4>2.3.2 Módulo Terapeutas - Clases De Equivalencia</h4>
  ${table(["Campo", "Clases válidas", "Clases inválidas"], terapeutaEquivalence)}
  <h4>Casos De Prueba - Terapeutas</h4>
  ${table(["ID", "Caso", "Datos", "Resultado esperado", "Resultado obtenido"], terapeutaCases, "small")}

  <h4>2.3.3 Módulo Terapias/Tratamientos - Clases De Equivalencia</h4>
  ${table(["Campo", "Clases válidas", "Clases inválidas"], tratamientoEquivalence)}
  <h4>Casos De Prueba - Tratamientos</h4>
  ${table(["ID", "Caso", "Datos", "Resultado esperado", "Resultado obtenido"], tratamientoCases, "small")}

  <h4>Casos Por Valores Límite</h4>
  ${table(["Módulo", "Campo", "Dato", "Escenario", "Resultado esperado"], boundaryRows, "small")}

  <h4>Pruebas Del Camino Básico</h4>
  ${table(["Camino", "Flujo", "Secuencia", "Resultado esperado"], basicPaths, "small")}

  <h4>Ejecución Y Evaluación</h4>
  ${table(["Herramienta", "Comando", "Resultado"], [
    ["Vitest", "npm run test", "Test Files: 10 passed. Tests: 107 passed. Duration: 6.84 s."],
    ["Jest", "npm run test:jest", "Test Suites: 10 passed. Tests: 107 passed. Time: 7.041 s."],
    ["Vitest Coverage", "npm run test:coverage", "Statements 71.83%, Branches 70.70%, Functions 76.66%, Lines 71.75%."],
  ])}
  ${code(`Pruebas específicas de los tres módulos:
- pacientesService.test.js: 12 aprobadas.
- terapeutasService.test.js: 12 aprobadas.
- tratamientosService.test.js: 9 aprobadas.
Total específico: 33 aprobadas.

Suite frontend completa:
- Vitest: 10 archivos aprobados, 107 pruebas aprobadas.
- Jest: 10 suites aprobadas, 107 pruebas aprobadas.`)}

  <h3>2.4 Pruebas De Integración</h3>
  ${p("La integración se evalúa desde los formularios/listados hacia servicios y API client. En el nivel automatizado se prueban principalmente los servicios, y en el nivel de diseño se documentan los puntos de integración visual pendientes de ejecución manual.")}
  ${table(["ID", "Integración", "Entrada", "Resultado esperado", "Estado"], integrationRows, "small")}

  <h3>2.5 Pruebas De Sistema</h3>
  ${table(["Tipo", "Foco", "Herramienta", "Resultado"], systemRows)}
  ${code(`Build de sistema:
npm run build
Resultado: build exitoso.
Observación: Vite reporta advertencia por chunk JavaScript grande; no bloquea la entrega, pero se recomienda code-splitting en una iteración posterior.`)}

  <h3>2.6 Pruebas De Aceptación</h3>
  ${table(["ID", "Requisito", "Escenario", "Pasos", "Resultado esperado", "Resultado obtenido"], acceptanceRows, "small")}

  ${pageBreak()}
  <h2>3. Conclusiones</h2>
  ${ol([
    "El entregable queda corregido para trabajar únicamente los tres módulos del PDF original: Pacientes, Terapeutas y Terapias/Tratamientos.",
    "Pacientes cuenta con 12 pruebas automatizadas que validan filtrado por rol 1, creación, actualización, eliminación y errores del API.",
    "Terapeutas cuenta con 12 pruebas automatizadas que validan filtrado por rol 2, creación, actualización preservando rol y terapeutas activos.",
    "Tratamientos ahora cuenta con 9 pruebas automatizadas nuevas que cubren CRUD, error 409 y asociación/remoción de equipos.",
    "La suite frontend completa quedó aprobada en Vitest y Jest con 107 pruebas exitosas.",
    "Las pruebas de aceptación de interfaz quedan diseñadas y listas para ejecutarse manualmente o automatizarse con Selenium/Katalon.",
    "Quedan pendientes pantallazos, diagramas gráficos y herramientas externas como JMeter/OWASP ZAP si el docente las exige como evidencia visual."
  ])}

  <h2>4. Referencias Y Pendientes</h2>
  ${ul([
    "Plantilla proyecto final - Pruebas.doc.",
    "Proyecto final primera entrega.pdf original, con los módulos de pacientes, terapeutas y tratamientos.",
    "Código fuente local de KineSys: kinesys/src/services y kinesys/src/pages/GestionAdmin.",
    "Salidas de ejecución en artifacts/pruebas: vitest-output-focused.txt, jest-output-focused.txt y coverage-output-focused.txt."
  ])}
  ${table(["Pendiente", "Motivo", "Avance actual"], pendingRows)}
</body>
</html>`;

const htmlPath = path.join(outDir, "Proyecto_Final_Primera_Entrega_KineSys_3_Modulos.html");
fs.writeFileSync(htmlPath, html, "utf8");
console.log(htmlPath);
