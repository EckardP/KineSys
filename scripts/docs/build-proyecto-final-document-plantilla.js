const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const outDir = path.join(root, "artifacts", "documentos", "primera-entrega");
const screenshotDir = path.join(root, "artifacts", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imgData(name) {
  const file = path.join(screenshotDir, name);
  if (!fs.existsSync(file)) return "";
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
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
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table>`;
}

function textTable(headers, rows, cls = "") {
  return table(headers, rows.map((row) => row.map(esc)), cls);
}

function twoCol(rows, cls = "") {
  return `<table${cls ? ` class="${cls}"` : ""}><tbody>${rows
    .map(([a, b]) => `<tr><th>${esc(a)}</th><td>${b}</td></tr>`)
    .join("")}</tbody></table>`;
}

function code(text) {
  return `<pre><code>${esc(text)}</code></pre>`;
}

function pageBreak() {
  return `<div class="page-break"></div>`;
}

function screenshot(name, caption) {
  const src = imgData(name);
  if (!src) {
    return `<div class="placeholder">Pantallazo pendiente: ${esc(caption)}</div>`;
  }
  return `<figure><img src="${src}" alt="${esc(caption)}"><figcaption>${esc(caption)}</figcaption></figure>`;
}

function evalTable(caso, imagen, resultado, obs, concepto) {
  return `<table class="template-table">
    <thead><tr><th colspan="3">Prueba</th></tr><tr><th>Caso de prueba</th><th>Imagen de la prueba</th><th>Resultado</th></tr></thead>
    <tbody>
      <tr><td>${esc(caso)}</td><td>${imagen}</td><td>${esc(resultado)}</td></tr>
      <tr><th colspan="2">Observaciones Técnicas/funcionales</th><td>${esc(obs)}</td></tr>
      <tr><th colspan="2">Concepto Final</th><td>${esc(concepto)}</td></tr>
    </tbody>
  </table>`;
}

function systemTestTable(tipo, nombre, descripcion, ambiente, herramienta, detalle, resultado) {
  return twoCol(
    [
      ["Tipo de Prueba", esc(tipo)],
      ["Nombre de la Prueba", esc(nombre)],
      ["Descripción de la Prueba", esc(descripcion)],
      ["Ambiente o condiciones previas y necesarias para su ejecución.", esc(ambiente)],
      ["Herramientas y metodología utilizada.", esc(herramienta)],
      ["Detalle de la ejecución de la prueba (Pantallazos)", detalle],
      ["Resultado de la Prueba.", esc(resultado)],
    ],
    "template-table"
  );
}

function acceptanceCase(id, req, escenario, datos, pasos, esperado, obtenido) {
  return `<table class="template-table">
    <tbody>
      <tr><th>ID Caso: ${esc(id)}</th><th>Requisito Asociado: ${esc(req)}</th><th>Escenario de Negocio</th></tr>
      <tr><td colspan="2">Datos de entrada:<br>${esc(datos)}</td><td>${esc(escenario)}</td></tr>
      <tr><td colspan="2">Pasos de Ejecución:<br>${esc(pasos)}</td><td></td></tr>
      <tr><td colspan="2">Resultado Esperado:<br>${esc(esperado)}</td><td>Resultado Obtenido:<br>${esc(obtenido)}</td></tr>
    </tbody>
  </table>`;
}

const patientEquivalence = [
  ["Nombres", "CE-PAC-01: 2 a 50 caracteres, solo letras y espacios", "CE-PAC-02: vacío; CE-PAC-03: mayor a 50; CE-PAC-04: contiene números"],
  ["Apellidos", "CE-PAC-05: 2 a 50 caracteres, solo letras y espacios", "CE-PAC-06: vacío; CE-PAC-07: mayor a 50; CE-PAC-08: contiene números"],
  ["Tipo Documento", "CE-PAC-09: CC; CE-PAC-10: TI; CE-PAC-11: CE; CE-PAC-12: PA", "CE-PAC-13: valor no permitido o sin selección"],
  ["Documento Identidad", "CE-PAC-14: 6 a 15 dígitos", "CE-PAC-15: menor a 6; CE-PAC-16: mayor a 15; CE-PAC-17: contiene letras; CE-PAC-18: vacío"],
  ["Correo", "CE-PAC-19: formato usuario@dominio.com", "CE-PAC-20: sin @; CE-PAC-21: sin dominio; CE-PAC-22: vacío si es obligatorio"],
  ["Teléfono/Celular", "CE-PAC-23: 10 dígitos", "CE-PAC-24: menor a 10; CE-PAC-25: mayor a 10; CE-PAC-26: contiene letras"],
  ["Fecha nacimiento", "CE-PAC-27: fecha válida pasada", "CE-PAC-28: fecha futura; CE-PAC-29: formato inválido"],
  ["EPS/Afiliación", "CE-PAC-30: EPS existente o Sin EPS", "CE-PAC-31: EPS inexistente; CE-PAC-32: afiliación incompleta cuando se selecciona EPS"],
];

const therapistEquivalence = [
  ["Usuario", "CE-TER-01: 4 a 20 caracteres alfanuméricos", "CE-TER-02: vacío; CE-TER-03: menor a 4; CE-TER-04: mayor a 20; CE-TER-05: caracteres especiales"],
  ["Contraseña", "CE-TER-06: mínimo 6 caracteres en creación", "CE-TER-07: vacía en creación; CE-TER-08: menor a 6"],
  ["Tipo Documento", "CE-TER-09: CC; CE-TER-10: CE; CE-TER-11: TI; CE-TER-12: PA", "CE-TER-13: sin selección"],
  ["Documento Identidad", "CE-TER-14: 6 a 15 dígitos", "CE-TER-15: menor a 6; CE-TER-16: mayor a 15; CE-TER-17: caracteres inválidos"],
  ["Nombres/Apellidos", "CE-TER-18: 2 a 50 caracteres", "CE-TER-19: menor a 2; CE-TER-20: mayor a 50; CE-TER-21: vacío"],
  ["Licencia profesional", "CE-TER-22: texto no vacío", "CE-TER-23: vacío; CE-TER-24: duplicado"],
  ["Título académico", "CE-TER-25: texto no vacío", "CE-TER-26: vacío; CE-TER-27: demasiado corto"],
  ["Años experiencia", "CE-TER-28: 0 a 99", "CE-TER-29: negativo; CE-TER-30: mayor a 99; CE-TER-31: texto"],
];

const treatmentEquivalence = [
  ["Nombre", "CE-TRA-01: texto no vacío", "CE-TRA-02: vacío; CE-TRA-03: solo espacios"],
  ["Especialidad", "CE-TRA-04: ID existente y diferente de 0", "CE-TRA-05: 0; CE-TRA-06: inexistente"],
  ["Duración", "CE-TRA-07: 5 a 240 minutos", "CE-TRA-08: menor a 5; CE-TRA-09: mayor a 240; CE-TRA-10: no numérico"],
  ["Costo base", "CE-TRA-11: mayor o igual a 0", "CE-TRA-12: negativo; CE-TRA-13: no numérico"],
  ["Sesiones recomendadas", "CE-TRA-14: 1 a 50", "CE-TRA-15: menor a 1; CE-TRA-16: mayor a 50"],
  ["Frecuencia", "CE-TRA-17: Diaria, Semanal, Quincenal o Mensual", "CE-TRA-18: valor diferente"],
  ["Equipo requerido", "CE-TRA-19: equipo existente y cantidad >= 1", "CE-TRA-20: sin equipo; CE-TRA-21: cantidad 0; CE-TRA-22: cantidad mayor a disponibilidad sin confirmación"],
];

const patientCases = [
  ["Ana", "Pérez", "CC", "12345678", "ana@mail.com", "3001234567", "CE-PAC-01,05,09,14,19,23", "Registro exitoso"],
  ["", "Pérez", "CC", "12345678", "ana@mail.com", "3001234567", "CE-PAC-02", "Error: nombre requerido"],
  ["Ana", "", "CC", "12345678", "ana@mail.com", "3001234567", "CE-PAC-06", "Error: apellido requerido"],
  ["Ana1", "Pérez", "CC", "12345678", "ana@mail.com", "3001234567", "CE-PAC-04", "Error: nombre inválido"],
  ["Ana", "Pérez", "CC", "12345", "ana@mail.com", "3001234567", "CE-PAC-15", "Error: documento corto"],
  ["Ana", "Pérez", "CC", "12345678", "anamail.com", "3001234567", "CE-PAC-20", "Error: correo inválido"],
];

const therapistCases = [
  ["ter123", "123456", "CC", "987654321", "Carlos", "Ramírez", "FT-001", "Lic. Fisioterapia", "CE-TER-01,06,09,14,18,22,25", "Registro exitoso"],
  ["ter", "123456", "CC", "987654321", "Carlos", "Ramírez", "FT-001", "Lic. Fisioterapia", "CE-TER-03", "Error: usuario inválido"],
  ["ter123", "12345", "CC", "987654321", "Carlos", "Ramírez", "FT-001", "Lic. Fisioterapia", "CE-TER-08", "Error: contraseña corta"],
  ["ter123", "123456", "", "987654321", "Carlos", "Ramírez", "FT-001", "Lic. Fisioterapia", "CE-TER-13", "Error: tipo documento requerido"],
  ["ter123", "123456", "CC", "abc", "Carlos", "Ramírez", "FT-001", "Lic. Fisioterapia", "CE-TER-17", "Error: documento inválido"],
  ["ter123", "123456", "CC", "987654321", "Carlos", "Ramírez", "", "Lic. Fisioterapia", "CE-TER-23", "Error: licencia requerida"],
];

const treatmentCases = [
  ["Terapia física", "1", "60", "150000", "10", "Semanal", "CE-TRA-01,04,07,11,14,17", "Registro exitoso"],
  ["", "1", "60", "150000", "10", "Semanal", "CE-TRA-02", "Error: nombre requerido"],
  [" ", "1", "60", "150000", "10", "Semanal", "CE-TRA-03", "Error: nombre requerido"],
  ["Rehabilitación", "0", "60", "150000", "10", "Semanal", "CE-TRA-05", "Error: especialidad requerida"],
  ["Masaje", "1", "4", "80000", "10", "Semanal", "CE-TRA-08", "Error: duración fuera de límite"],
  ["Electroterapia", "1", "241", "80000", "10", "Semanal", "CE-TRA-09", "Error: duración fuera de límite"],
  ["Terapia manual", "1", "60", "-1", "10", "Semanal", "CE-TRA-12", "Error: costo inválido"],
  ["Terapia manual", "1", "60", "150000", "51", "Semanal", "CE-TRA-16", "Error: sesiones inválidas"],
];

const boundaryRows = [
  ["Paciente", "Documento", "12345", "Límite inferior -1", "Error"],
  ["Paciente", "Documento", "123456", "Límite inferior exacto", "OK"],
  ["Paciente", "Documento", "123456789012345", "Límite superior exacto", "OK"],
  ["Paciente", "Documento", "1234567890123456", "Límite superior +1", "Error"],
  ["Paciente", "Teléfono", "300123456", "Límite inferior -1", "Error"],
  ["Paciente", "Teléfono", "3001234567", "Límite exacto", "OK"],
  ["Terapeuta", "Usuario", "abc", "Límite inferior -1", "Error"],
  ["Terapeuta", "Usuario", "abcd", "Límite inferior exacto", "OK"],
  ["Terapeuta", "Contraseña", "12345", "Límite inferior -1", "Error"],
  ["Terapeuta", "Contraseña", "123456", "Límite inferior exacto", "OK"],
  ["Terapeuta", "Años experiencia", "-1", "Límite inferior -1", "Error"],
  ["Terapeuta", "Años experiencia", "0", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Duración", "4", "Límite inferior -1", "Error"],
  ["Tratamiento", "Duración", "5", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Duración", "240", "Límite superior exacto", "OK"],
  ["Tratamiento", "Duración", "241", "Límite superior +1", "Error"],
  ["Tratamiento", "Sesiones", "0", "Límite inferior -1", "Error"],
  ["Tratamiento", "Sesiones", "1", "Límite inferior exacto", "OK"],
  ["Tratamiento", "Costo", "-1", "Límite inferior -1", "Error"],
  ["Tratamiento", "Costo", "0", "Límite inferior exacto", "OK"],
];

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>KineSys - Entrega Plantilla 3 Módulos</title>
  <style>
    @page { size: A4; margin: 15mm 12mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Times New Roman", Georgia, serif;
      color: #111;
      font-size: 10pt;
      line-height: 1.28;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4 { font-family: Arial, sans-serif; margin: 0 0 6px; line-height: 1.15; }
    h1 { font-size: 22pt; text-align: center; text-transform: uppercase; }
    h2 { font-size: 15pt; text-transform: uppercase; margin-top: 13px; border-bottom: 1px solid #111; padding-bottom: 3px; }
    h3 { font-size: 12pt; text-transform: uppercase; margin-top: 11px; }
    h4 { font-size: 10.5pt; margin-top: 8px; }
    p { margin: 0 0 6px; text-align: justify; }
    ul, ol { margin: 4px 0 8px 20px; padding: 0; }
    li { margin: 1px 0; }
    table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; page-break-inside: avoid; }
    th, td { border: 1px solid #111; padding: 4px 5px; vertical-align: top; }
    th { font-weight: bold; background: #e9eef3; text-align: left; }
    .template-table th { background: #e9eef3; }
    .small th, .small td { font-size: 8.8pt; padding: 3px 4px; }
    .center { text-align: center; }
    .cover {
      min-height: 262mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      border: 2px solid #111;
      padding: 25mm 18mm;
    }
    .cover p { text-align: center; font-size: 12pt; }
    .cover h1 { font-size: 24pt; margin-bottom: 10px; }
    .page-break { break-before: page; page-break-before: always; }
    .toc p { text-align: left; margin: 2px 0; }
    figure { margin: 6px 0 10px; page-break-inside: avoid; }
    figure img { width: 100%; max-height: 145mm; object-fit: contain; border: 1px solid #555; }
    figcaption { font-size: 8.8pt; font-style: italic; text-align: center; margin-top: 2px; }
    .thumb img { max-height: 52mm; }
    .placeholder { border: 1px dashed #555; padding: 12px; text-align: center; font-style: italic; background: #f8f8f8; }
    pre { white-space: pre-wrap; font-family: Consolas, monospace; font-size: 8.5pt; border: 1px solid #333; padding: 6px; margin: 5px 0 9px; background: #f7f7f7; }
    .note { font-size: 8.8pt; color: #333; }
  </style>
</head>
<body>
  <section class="cover">
    <h1>KINESYS</h1>
    <p><strong>Sistema de Gestión de Clínica de Fisioterapia</strong></p>
    <p><strong>Proyecto final - primera entrega</strong></p>
    <p><strong>Documento diligenciado según plantilla de pruebas</strong></p>
    <br>
    <p><strong>Módulos evaluados:</strong></p>
    <p>Registro/Gestión de Pacientes</p>
    <p>Registro/Gestión de Terapeutas</p>
    <p>Gestión de Terapias y Tratamientos</p>
    <br>
    <p><strong>Estudiantes:</strong></p>
    <p>Eckard Antony Rodriguez Gutierrez</p>
    <p>Luis Alejandro Narvaez Teran</p>
    <br>
    <p><strong>Docente:</strong> Maribel Romero Mestre</p>
    <p>Universidad Popular del Cesar - Sede Sabanas</p>
    <p>Ingeniería de Sistemas</p>
    <p>Valledupar - Cesar</p>
    <p>2026</p>
  </section>

  ${pageBreak()}
  <h2>Contenido</h2>
  <div class="toc">
    <p>PRIMERA PARTE</p>
    <p>Descripción del sistema</p>
    <p>Identificación del problema</p>
    <p>Descripción detallada del sistema o aplicación</p>
    <p>Modelo de requerimientos</p>
    <p>Modelo de casos de uso</p>
    <p>Modelo de diseño del sistema</p>
    <p>Producto del software</p>
    <br>
    <p>SEGUNDA PARTE</p>
    <p>Pruebas del software</p>
    <p>Introducción</p>
    <p>Planificación de las pruebas</p>
    <p>Pruebas unitarias</p>
    <p>Pruebas de integración</p>
    <p>Pruebas de sistemas</p>
    <p>Pruebas de aceptación</p>
    <p>Conclusiones</p>
  </div>

  ${pageBreak()}
  <h2>PRIMERA PARTE</h2>
  <h2>Descripción Del Sistema</h2>
  <h3>Identificación Del Problema</h3>
  ${p("En la clínica de fisioterapia se requiere controlar información crítica de pacientes, terapeutas y tratamientos. Cuando estos procesos se hacen de forma manual se presentan registros incompletos, duplicidad de documentos, dificultad para diferenciar pacientes y terapeutas, errores en la asignación de tratamientos y poca trazabilidad de equipos requeridos.")}
  ${p("Para esta entrega se delimita el trabajo a tres módulos que ya venían desarrollados en el PDF inicial: Registro/Gestión de Pacientes, Registro/Gestión de Terapeutas y Gestión de Terapias/Tratamientos.")}

  <h3>Descripción Detallada Del Sistema O Aplicación</h3>
  ${p("KineSys es una aplicación web construida con React y Vite en el frontend, y ASP.NET Core Web API con Entity Framework Core y SQL Server en el backend. La aplicación automatiza la administración de pacientes, terapeutas y tratamientos mediante formularios, listados, servicios de comunicación con API y validaciones funcionales.")}
  ${p("Los procesos automatizados en el alcance de este documento son: creación y filtrado de pacientes por rol 1, creación y filtrado de terapeutas por rol 2, mantenimiento de tratamientos, relación de tratamientos con especialidades y equipos, validación de datos de entrada, control de errores del API y pruebas automatizadas de servicios.")}

  <h3>Modelo De Requerimientos</h3>
  <h4>Descripción Requisitos Funcionales</h4>
  ${textTable(["ID", "Módulo", "Requisito funcional"], [
    ["RF-PAC-01", "Pacientes", "Registrar paciente con datos personales, documento, contacto, EPS/seguro y rol Paciente."],
    ["RF-PAC-02", "Pacientes", "Listar únicamente personas con rol = 1."],
    ["RF-PAC-03", "Pacientes", "Consultar, actualizar y eliminar pacientes."],
    ["RF-TER-01", "Terapeutas", "Registrar terapeuta con datos de acceso, personales, contacto y profesionales."],
    ["RF-TER-02", "Terapeutas", "Listar únicamente personas con rol = 2 y obtener terapeutas activos."],
    ["RF-TER-03", "Terapeutas", "Actualizar terapeuta preservando rol Terapeuta."],
    ["RF-TRA-01", "Tratamientos", "Registrar tratamiento con nombre, especialidad, duración, costo, sesiones y frecuencia."],
    ["RF-TRA-02", "Tratamientos", "Listar, consultar, actualizar y eliminar tratamientos."],
    ["RF-TRA-03", "Tratamientos", "Agregar y remover equipos requeridos del tratamiento."],
  ])}
  <h4>Descripción Requisitos No Funcionales</h4>
  ${textTable(["ID", "Atributo", "Requisito no funcional"], [
    ["RNF-01", "Mantenibilidad", "Separar interfaz, servicios y API client por módulo."],
    ["RNF-02", "Seguridad", "Consumir endpoints mediante apiCliente con token JWT cuando exista sesión."],
    ["RNF-03", "Integridad", "Diferenciar paciente y terapeuta por rol y validar especialidad de tratamiento."],
    ["RNF-04", "Usabilidad", "Presentar formularios con campos requeridos, mensajes de error y estados de carga."],
    ["RNF-05", "Testabilidad", "Contar con pruebas automatizadas en Jest/Vitest para servicios críticos."],
  ])}

  <h3>Modelo De Casos De Uso</h3>
  <h4>Diagrama de caso de uso</h4>
  ${textTable(["Actor", "Casos de uso"], [
    ["Administrador", "Registrar paciente, consultar paciente, actualizar paciente, eliminar paciente."],
    ["Administrador", "Registrar terapeuta, consultar terapeuta, actualizar terapeuta, eliminar terapeuta, listar terapeutas activos."],
    ["Administrador", "Registrar tratamiento, consultar tratamiento, actualizar tratamiento, eliminar tratamiento, agregar/remover equipos."],
    ["Sistema", "Validar rol, enviar datos a API, manejar errores 409/500, actualizar listados."],
  ])}
  <h4>Descripción de caso de uso</h4>
  ${textTable(["ID Caso Uso", "Nombre", "Actor", "Flujo principal", "Resultado"], [
    ["CU-PAC-01", "Registrar Paciente", "Administrador", "Abrir formulario, ingresar datos válidos, guardar.", "Paciente creado con rol 1."],
    ["CU-TER-01", "Registrar Terapeuta", "Administrador", "Abrir formulario, ingresar acceso y datos profesionales, guardar.", "Terapeuta creado con rol 2."],
    ["CU-TRA-01", "Registrar Tratamiento", "Administrador", "Abrir formulario, seleccionar especialidad, definir duración/costo/equipos, guardar.", "Tratamiento creado."],
  ])}

  <h3>Modelo De Diseño Del Sistema</h3>
  ${textTable(["Modelo solicitado", "Contenido adelantado"], [
    ["Diagrama de clases detallado", "Persona hereda a Paciente y Terapeuta. Tratamiento se relaciona con especialidades, equipos y servicios."],
    ["Diagramas de secuencias", "Formulario React -> service.js -> apiCliente -> API .NET -> SQL Server -> respuesta."],
    ["Diagrama entidad relación", "Paciente, Terapeuta y Tratamiento se persisten como entidades del contexto ClinicaFisioterapiaBD."],
    ["Diagrama de componentes", "Pages/Formularios, services, api, backend controllers, EF Core, SQL Server."],
  ])}

  <h3>Producto Del Software</h3>
  ${p("Pantallazos de la aplicación correspondientes a los tres módulos trabajados:")}
  ${screenshot("modulo-pacientes.png", "Pantallazo módulo Registro/Gestión de Pacientes")}
  ${screenshot("modulo-terapeutas.png", "Pantallazo módulo Registro/Gestión de Terapeutas")}
  ${screenshot("modulo-tratamientos.png", "Pantallazo módulo Gestión de Terapias y Tratamientos")}
  ${textTable(["Elemento", "Acceso"], [
    ["Frontend local", "cd kinesys; npm run dev; http://127.0.0.1:5173"],
    ["Pruebas", "cd kinesys; npm run test / npm run test:jest / npm run test:coverage"],
    ["Backend local", "cd api/ApiPrueba; dotnet run"],
    ["Link público", "Pendiente de despliegue."],
  ])}

  ${pageBreak()}
  <h2>SEGUNDA PARTE</h2>
  <h2>Pruebas Del Software</h2>
  <h3>Introducción</h3>
  ${p("La sección de pruebas documenta el proceso de validación de los tres módulos seleccionados. Se aplican pruebas unitarias, integración, sistema y aceptación, siguiendo las tablas y apartados solicitados por la plantilla.")}

  <h3>Planificación De Las Pruebas</h3>
  <h4>Objetivos</h4>
  ${p("Objetivo General: verificar y validar que los módulos de Pacientes, Terapeutas y Terapias/Tratamientos funcionen conforme a los requisitos definidos, con datos válidos y no válidos, control de errores y evidencia automatizada.")}
  ${ul([
    "Verificar que el módulo Pacientes registre, liste, consulte, actualice y elimine pacientes usando rol 1.",
    "Validar que el módulo Terapeutas registre, liste, consulte, actualice y filtre terapeutas usando rol 2.",
    "Comprobar que el módulo Tratamientos registre tratamientos válidos y gestione equipos asociados.",
    "Ejecutar pruebas unitarias con Vitest/Jest y evaluar resultados.",
  ])}

  <h4>Alcance</h4>
  ${twoCol([["Nombre de la aplicación a probar", esc("KineSys - Sistema de Gestión de Clínica de Fisioterapia")]], "template-table")}
  ${textTable(["Módulos a ser probados", "Objetivos de las pruebas"], [
    ["Módulo 1: Registro/Gestión de Pacientes", "Validar datos personales, documento, rol Paciente, creación, consulta, actualización y eliminación."],
    ["Módulo 2: Registro/Gestión de Terapeutas", "Validar datos de acceso, personales, profesionales, rol Terapeuta, creación, consulta, actualización y activos."],
    ["Módulo 3: Gestión de Terapias y Tratamientos", "Validar nombre, especialidad, duración, costo, sesiones, frecuencia, equipos y CRUD de tratamientos."],
  ], "template-table")}

  <h4>Estrategias De Pruebas</h4>
  <table class="template-table">
    <thead>
      <tr><th colspan="4" class="center">Niveles, tipos y métodos de prueba</th></tr>
      <tr><th>Niveles de pruebas</th><th>Técnicas de pruebas</th><th>Modelos/estrategias/tipos</th><th>Herramientas de pruebas</th></tr>
    </thead>
    <tbody>
      <tr><td>Pruebas unitarias</td><td>Caja negra y caja blanca</td><td>Clases de equivalencia, valores límites, camino básico</td><td>Vitest, Jest, Testing Library, mocks de API</td></tr>
      <tr><td>Pruebas de integración</td><td>Caja negra</td><td>Incremental y basada en hilos</td><td>Vitest/Jest, revisión de flujo Formulario -> Servicio -> API</td></tr>
      <tr><td>Pruebas de sistemas</td><td>Caja negra</td><td>Rendimiento, seguridad, usabilidad y portabilidad</td><td>Vite build, revisión funcional, evidencia local</td></tr>
      <tr><td>Pruebas de aceptación</td><td>Caja negra</td><td>Casos de usuario final por módulo</td><td>Manual; pendiente Selenium/Katalon</td></tr>
    </tbody>
  </table>

  <h4>Ambiente De Pruebas</h4>
  ${textTable(["EQUIPO", "ESPECIFICACIONES TECNICAS"], [
    ["Equipo de desarrollo", "Windows 11 Home Single Language 64 bits; Intel Core i5-1235U; 10 núcleos; 12 procesadores lógicos; 15.7 GB RAM."],
    ["Repositorio local", "C:\\Users\\carde\\Documents\\ProgramacionMovil\\KineSys"],
  ], "template-table")}
  ${textTable(["SOFTWARE", "VERSION"], [
    ["Node.js", "v24.14.0"],
    ["npm", "11.9.0"],
    ["React", "19.1.1"],
    ["Vite", "7.x"],
    ["Vitest", "4.1.5"],
    ["Jest", "30.3.0"],
    ["ASP.NET Core", "net8.0"],
    ["SQL Server", "Configurado por docker-compose"],
  ], "template-table")}

  <h2>Pruebas Unitarias</h2>
  <p>[Los siguientes pasos se repiten por cada componente a probar]</p>

  <h3>Módulo 1: Registro/Gestión De Pacientes</h3>
  <h4>Análisis De Las Pruebas</h4>
  ${p("Nombre del Módulo: Registro/Gestión de Pacientes")}
  ${screenshot("modulo-pacientes.png", "Interfaz de entrada - Pacientes")}
  <h4>Análisis de pruebas clases de equivalencias</h4>
  ${textTable(["Condiciones de Entrada", "Clases de equivalencia válida", "Clases de equivalencia no válida"], patientEquivalence, "small")}
  <h4>Casos de pruebas</h4>
  ${textTable(["Nombres", "Apellidos", "Tipo Doc", "Documento", "Email", "Teléfono", "Clases cubiertas", "Resultado esperado"], patientCases, "small")}

  <h3>Módulo 2: Registro/Gestión De Terapeutas</h3>
  <h4>Análisis De Las Pruebas</h4>
  ${p("Nombre del Módulo: Registro/Gestión de Terapeutas")}
  ${screenshot("modulo-terapeutas.png", "Interfaz de entrada - Terapeutas")}
  <h4>Análisis de pruebas clases de equivalencias</h4>
  ${textTable(["Condiciones de Entrada", "Clases de equivalencia válida", "Clases de equivalencia no válida"], therapistEquivalence, "small")}
  <h4>Casos de pruebas</h4>
  ${textTable(["Usuario", "Contraseña", "Tipo Doc", "Documento", "Nombres", "Apellidos", "Licencia", "Título", "Clases cubiertas", "Resultado esperado"], therapistCases, "small")}

  <h3>Módulo 3: Gestión De Terapias Y Tratamientos</h3>
  <h4>Análisis De Las Pruebas</h4>
  ${p("Nombre del Módulo: Gestión de Terapias y Tratamientos")}
  ${screenshot("modulo-tratamientos.png", "Interfaz de entrada - Tratamientos")}
  <h4>Análisis de pruebas clases de equivalencias</h4>
  ${textTable(["Condiciones de Entrada", "Clases de equivalencia válida", "Clases de equivalencia no válida"], treatmentEquivalence, "small")}
  <h4>Casos de pruebas</h4>
  ${textTable(["Nombre", "Especialidad", "Duración", "Costo", "Sesiones", "Frecuencia", "Clases cubiertas", "Resultado esperado"], treatmentCases, "small")}

  <h4>Casos De Pruebas Por Valores Límites</h4>
  ${textTable(["MÓDULO", "CAMPO", "Datos de entrada", "Escenario", "Resultado"], boundaryRows, "small")}

  <h4>Pruebas Del Camino Básico</h4>
  ${p("Caso de uso a validar: registro/actualización de cada uno de los tres módulos trabajados.")}
  ${code(`Fragmentos de métodos validados:

crearPaciente(data):
  datosCompletos = { ...data, user: documentoIdentidad, password: documentoIdentidad, activo: true, fechaRegistro }
  pacientesApi.create('/Register', datosCompletos)

crearTerapeuta(data):
  datosCompletos = { ...data, activo: true, fechaRegistro, rol: 2 }
  terapeutasApi.create('/Register', datosCompletos)

crearTratamiento(data):
  tratamientosApi.create('', tratamientoData)
  si error 409: "Ya existe un tratamiento con ese nombre"`) }
  ${textTable(["CAMINO", "DATOS ENTRADA", "ESCENARIO"], [
    ["PAC-C1", "Paciente válido: Ana Pérez, CC 12345678", "Paciente creado correctamente."],
    ["PAC-C2", "API retorna persona con rol 2", "obtenerPaciente lanza error: no es un paciente."],
    ["PAC-C3", "API responde 409", "Mensaje de documento duplicado."],
    ["TER-C1", "Terapeuta válido con licencia y título", "Terapeuta creado con rol 2."],
    ["TER-C2", "Actualizar terapeuta sin rol en data", "Servicio preserva rol 2."],
    ["TER-C3", "API retorna persona con rol 1", "obtenerTerapeuta lanza error: no es un terapeuta."],
    ["TRA-C1", "Tratamiento válido con especialidad 1", "Tratamiento creado correctamente."],
    ["TRA-C2", "Especialidad 0", "Formulario bloquea y muestra error."],
    ["TRA-C3", "API responde 409", "Mensaje de tratamiento duplicado."],
  ], "template-table")}

  <h4>Diseño Casos De Pruebas</h4>
  ${textTable(["S#", "Prerrequisitos", "S#", "Datos de pruebas"], [
    ["1", "Aplicación frontend en ejecución", "1", "Paciente con documento 12345678"],
    ["2", "Servicios API mockeados o backend disponible", "2", "Terapeuta con usuario ter123 y licencia FT-001"],
    ["3", "Usuario administrador con acceso al módulo", "3", "Tratamiento Terapia física con especialidad 1"],
    ["4", "Vitest/Jest instalados", "4", "Casos válidos y no válidos por equivalencia"],
  ], "template-table")}
  ${textTable(["PASO", "Detalles del Paso", "Resultados Esperados", "Resultados Actuales", "Estado"], [
    ["1", "Ejecutar prueba de pacientes", "12 casos aprobados", "12 casos aprobados", "Ejecutado"],
    ["2", "Ejecutar prueba de terapeutas", "12 casos aprobados", "12 casos aprobados", "Ejecutado"],
    ["3", "Ejecutar prueba de tratamientos", "9 casos aprobados", "9 casos aprobados", "Ejecutado"],
    ["4", "Ejecutar suite completa frontend", "107 casos aprobados", "107 casos aprobados", "Ejecutado"],
  ], "template-table")}

  <h4>Ejecución Y Evaluación De Las Pruebas</h4>
  ${evalTable(
    "npm run test -- src/services/pacientesService.test.js",
    "Evidencia: artifacts/pruebas/pacientes-vitest.txt",
    "Test Files: 1 passed. Tests: 12 passed.",
    "Valida filtrado por rol 1, creación con user/password por documento, actualización, eliminación y errores.",
    "Aprobado"
  )}
  ${evalTable(
    "npm run test -- src/services/terapeutasService.test.js",
    "Evidencia: artifacts/pruebas/terapeutas-vitest.txt",
    "Test Files: 1 passed. Tests: 12 passed.",
    "Valida filtrado por rol 2, creación activa, actualización preservando rol, eliminación y activos.",
    "Aprobado"
  )}
  ${evalTable(
    "npm run test -- src/services/tratamientosService.test.js",
    "Evidencia: artifacts/pruebas/tratamientos-vitest.txt",
    "Test Files: 1 passed. Tests: 9 passed.",
    "Valida CRUD de tratamientos, error 409 y rutas anidadas de equipos.",
    "Aprobado"
  )}

  <h2>Pruebas De Integración</h2>
  <h3>Estrategia De Pruebas Incrementales</h3>
  <h4>Análisis De Las Pruebas</h4>
  ${p("Esquema de integración de los componentes de la aplicación: Interfaz React -> service.js -> apiCliente -> API .NET -> Base de datos.")}
  ${textTable(["Tipo de integración", "Descripción"], [
    ["Integración Incremental Ascendente", "Se validan primero los servicios pacientesService, terapeutasService y tratamientosService; luego se conectan con formularios/listados."],
    ["Integración Incremental Descendente", "Se parte de los formularios de usuario y se verifica que construyan datos compatibles con los servicios."],
  ], "template-table")}
  <h4>Diseño De Los Casos De Pruebas</h4>
  ${textTable(["ID", "Integración", "Datos", "Resultado esperado", "Estado"], [
    ["INT-PAC-01", "PatientForm -> pacientesService -> pacientesApi", "Datos válidos de paciente", "Payload incluye user/password igual al documento, activo true y fechaRegistro.", "Ejecutado parcialmente en servicio"],
    ["INT-TER-01", "TerapeutaForm -> terapeutasService -> terapeutasApi", "Datos válidos de terapeuta", "Payload incluye rol 2 y datos profesionales.", "Ejecutado parcialmente en servicio"],
    ["INT-TRA-01", "TratamientoForm -> tratamientosService -> tratamientosApi", "Datos válidos de tratamiento", "Payload enviado al endpoint base de tratamientos.", "Ejecutado parcialmente en servicio"],
    ["INT-TRA-02", "TratamientoForm -> equipos", "Equipo y cantidad", "Ruta /{idTratamiento}/equipos para agregar y remover equipos.", "Ejecutado en servicio"],
  ], "template-table")}
  <h4>Ejecución Y Evaluación De Las Pruebas De Integración</h4>
  ${evalTable(
    "Suite completa frontend con integración de servicios: npm run test",
    "Evidencia: artifacts/pruebas/vitest-output-focused.txt",
    "Test Files: 10 passed. Tests: 107 passed.",
    "Integra servicios de los tres módulos con mocks de APIs y valida contratos de datos.",
    "Aprobado"
  )}

  <h3>Pruebas Basadas En Hilos</h3>
  <h4>Análisis De Las Pruebas</h4>
  ${textTable(["Nombre del caso de uso", "Diagrama de secuencia textual"], [
    ["Hilo Pacientes", "Administrador -> PatientForm -> pacientesService -> pacientesApi -> API -> respuesta -> lista actualizada"],
    ["Hilo Terapeutas", "Administrador -> TerapeutaForm -> terapeutasService -> terapeutasApi -> API -> respuesta -> lista actualizada"],
    ["Hilo Tratamientos", "Administrador -> TratamientoForm -> tratamientosService -> tratamientosApi -> API -> respuesta -> lista actualizada"],
  ], "template-table")}
  ${textTable(["Tabla de estado", "Valor"], [
    ["Inicial", "Formulario vacío/listado cargando"],
    ["Validando", "Campos obligatorios y clases válidas/no válidas"],
    ["Enviando", "Servicio construye payload y llama API"],
    ["Final", "Registro guardado o error mostrado"],
  ], "template-table")}
  <h4>Diseño De Los Casos De Pruebas</h4>
  ${textTable(["Hilo", "Datos de entrada", "Resultado esperado"], [
    ["Pacientes", "Documento válido, rol 1", "Paciente registrado y listado como paciente."],
    ["Terapeutas", "Usuario, contraseña, licencia y rol 2", "Terapeuta registrado y listado como terapeuta."],
    ["Tratamientos", "Nombre, especialidad, duración, costo y equipo", "Tratamiento registrado y equipo asociado."],
  ], "template-table")}

  <h2>Pruebas De Sistemas</h2>
  <h3>5.1 Pruebas De Rendimiento</h3>
  ${systemTestTable(
    "RENDIMIENTO",
    "Construcción de producción de módulos Pacientes, Terapeutas y Tratamientos",
    "Verificar que la aplicación compile correctamente con los módulos incluidos.",
    "Node.js, npm, Vite, repositorio local.",
    "Vite build. Apache JMeter queda pendiente porque no está instalado en el equipo.",
    "Evidencia: artifacts/pruebas/build-output.txt",
    "Build exitoso. Vite advierte chunk JavaScript grande; se recomienda code-splitting."
  )}
  <h3>5.2 Pruebas De Seguridad</h3>
  ${systemTestTable(
    "SEGURIDAD",
    "Consumo de API autenticado",
    "Verificar que los módulos consuman servicios mediante apiCliente, que agrega Authorization Bearer cuando existe token.",
    "Frontend con sessionStorage/token disponible.",
    "Revisión de apiCliente y pruebas unitarias. OWASP ZAP queda pendiente porque no está instalado.",
    "Evidencia: apiCliente.test.js y servicios de los tres módulos.",
    "Se valida el manejo de token y limpieza de sesión ante 401 en la suite general."
  )}
  <h3>5.3 Pruebas De Usabilidad</h3>
  ${systemTestTable(
    "USABILIDAD",
    "Formularios de los tres módulos",
    "Verificar que los formularios tengan campos requeridos, listas, mensajes y botones de acción.",
    "Navegador Microsoft Edge headless y servidor Vite.",
    "Capturas de pantalla y revisión funcional.",
    `${screenshot("modulo-pacientes.png", "Pacientes")}${screenshot("modulo-terapeutas.png", "Terapeutas")}${screenshot("modulo-tratamientos.png", "Tratamientos")}`,
    "Las interfaces principales cargan y muestran los campos requeridos."
  )}
  <h3>5.4 Pruebas De Portabilidad</h3>
  ${systemTestTable(
    "PORTABILIDAD",
    "Ejecución en ambiente local Windows",
    "Comprobar que las pruebas y el frontend se ejecuten en el ambiente local del equipo.",
    "Windows 11, Node.js v24.14.0, npm 11.9.0.",
    "Vitest, Jest, Vite y Edge headless.",
    "Evidencia: ejecuciones de pruebas específicas y capturas.",
    "Pruebas y capturas generadas correctamente en el ambiente local."
  )}

  <h2>Pruebas De Aceptación</h2>
  <h3>Diseño De Los Casos De Pruebas</h3>
  ${acceptanceCase("CA-PAC-01", "RF-PAC-01", "Registro exitoso de paciente", "Paciente válido: Ana Pérez, CC 12345678.", "1. Abrir módulo Pacientes. 2. Ingresar datos. 3. Guardar.", "Paciente creado con rol 1.", "Diseñado; servicio automatizado aprobado.")}
  ${acceptanceCase("CA-TER-01", "RF-TER-01", "Registro exitoso de terapeuta", "Terapeuta válido con usuario, contraseña, licencia y título.", "1. Abrir módulo Terapeutas. 2. Ingresar datos. 3. Guardar.", "Terapeuta creado con rol 2.", "Diseñado; servicio automatizado aprobado.")}
  ${acceptanceCase("CA-TRA-01", "RF-TRA-01", "Registro exitoso de tratamiento", "Tratamiento válido con especialidad, duración, costo y frecuencia.", "1. Abrir módulo Tratamientos. 2. Ingresar datos. 3. Guardar.", "Tratamiento creado correctamente.", "Diseñado; servicio automatizado aprobado.")}
  ${acceptanceCase("CA-TRA-02", "RF-TRA-03", "Tratamiento sin especialidad", "idEspecialidad = 0.", "1. Abrir tratamiento. 2. Dejar especialidad sin seleccionar. 3. Guardar.", "Sistema muestra error y no envía datos.", "Diseñado; validación observada en código.")}
  <h3>Ejecución Y Evaluación De La Prueba</h3>
  ${evalTable(
    "Casos de aceptación de los tres módulos",
    "Capturas incluidas en Producto del software y Pruebas de Usabilidad.",
    "Los flujos quedan diseñados; ejecución manual completa pendiente con backend y datos reales.",
    "La plantilla sugiere Selenium/Katalon; esas herramientas no están configuradas en el proyecto. Se deja el diseño listo para automatización posterior.",
    "Parcialmente aprobado / pendiente de ejecución E2E"
  )}

  <h2>Conclusiones</h2>
  ${ol([
    "El documento fue reorganizado siguiendo las tablas y apartados de la plantilla para los tres módulos trabajados.",
    "El módulo Pacientes cuenta con clases de equivalencia, valores límite, camino básico, diseño de casos y 12 pruebas automatizadas aprobadas.",
    "El módulo Terapeutas cuenta con clases de equivalencia, valores límite, camino básico, diseño de casos y 12 pruebas automatizadas aprobadas.",
    "El módulo Tratamientos cuenta con clases de equivalencia, valores límite, camino básico, diseño de casos y 9 pruebas automatizadas aprobadas.",
    "La suite completa frontend queda en 10 archivos y 107 pruebas aprobadas tanto en Vitest como en Jest.",
    "Quedan pendientes pruebas E2E con Selenium/Katalon y herramientas externas JMeter/OWASP ZAP si el docente exige ejecución real con esas herramientas."
  ])}
</body>
</html>`;

const htmlPath = path.join(outDir, "Proyecto_Final_Primera_Entrega_KineSys_3_Modulos_Formato_Plantilla.html");
fs.writeFileSync(htmlPath, html, "utf8");
console.log(htmlPath);
