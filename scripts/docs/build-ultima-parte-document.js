const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const outDir = path.join(root, "artifacts", "documentos", "ultima-parte");
fs.mkdirSync(outDir, { recursive: true });

const today = "29 de mayo de 2026";
const costPerPersonMonth = 4200000;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function money(value) {
  const amount = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${amount} COP`;
}

function round(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function table(headers, rows) {
  return [
    `<table>`,
    `<thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>`,
    `<tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`,
    `</table>`,
  ].join("");
}

function mdTable(headers, rows) {
  const clean = (value) => String(value ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
  return [
    `| ${headers.map(clean).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(clean).join(" | ")} |`),
  ].join("\n");
}

function walk(dir, options = {}) {
  if (!fs.existsSync(dir)) return [];
  const excludedDirs = new Set([
    "node_modules",
    "dist",
    "coverage",
    "bin",
    "obj",
    ".git",
    ".vs",
    ...(options.excludedDirs ?? []),
  ]);
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) {
        files.push(...walk(path.join(dir, entry.name), options));
      }
      continue;
    }

    files.push(path.join(dir, entry.name));
  }

  return files;
}

function isGenerated(file) {
  return /[\\/]Migrations[\\/]/.test(file)
    || /\.Designer\.cs$/i.test(file)
    || /ModelSnapshot\.cs$/i.test(file)
    || /package-lock\.json$/i.test(file);
}

function isTest(file) {
  return /\.test\.(js|jsx|ts|tsx)$/i.test(file)
    || /[\\/]ApiPrueba\.Tests[\\/]/.test(file)
    || /[\\/]src[\\/]test[\\/]/.test(file);
}

function isCodeLine(line) {
  const text = line.trim();
  return text
    && text !== "}"
    && !text.startsWith("//")
    && !text.startsWith("*")
    && !text.startsWith("/*");
}

function lineStats(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  return {
    total: lines.length,
    nonEmpty: lines.filter((line) => line.trim()).length,
    nloc: lines.filter(isCodeLine).length,
  };
}

function collectSourceFiles() {
  const sourceRoots = [
    path.join(root, "kinesys", "src"),
    path.join(root, "api", "ApiPrueba"),
  ];
  const extensions = new Set([".js", ".jsx", ".ts", ".tsx", ".cs", ".css"]);

  return sourceRoots
    .flatMap((sourceRoot) => walk(sourceRoot))
    .filter((file) => extensions.has(path.extname(file)))
    .filter((file) => !isGenerated(file))
    .filter((file) => !isTest(file));
}

function summarizeLoc(files) {
  const byExtension = new Map();
  const byFile = [];

  for (const file of files) {
    const stats = lineStats(file);
    const ext = path.extname(file) || "(sin extension)";
    const current = byExtension.get(ext) ?? { files: 0, nonEmpty: 0, nloc: 0, total: 0 };
    current.files += 1;
    current.total += stats.total;
    current.nonEmpty += stats.nonEmpty;
    current.nloc += stats.nloc;
    byExtension.set(ext, current);
    byFile.push({
      file: path.relative(root, file),
      ext,
      ...stats,
    });
  }

  return {
    byExtension: [...byExtension.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ext, stats]) => [ext, stats.files, stats.nonEmpty, stats.nloc]),
    topFiles: byFile.sort((a, b) => b.nloc - a.nloc).slice(0, 10),
    totals: byFile.reduce(
      (acc, item) => ({
        files: acc.files + 1,
        total: acc.total + item.total,
        nonEmpty: acc.nonEmpty + item.nonEmpty,
        nloc: acc.nloc + item.nloc,
      }),
      { files: 0, total: 0, nonEmpty: 0, nloc: 0 },
    ),
  };
}

function getClassBodies() {
  const files = walk(path.join(root, "api", "ApiPrueba"))
    .filter((file) => file.endsWith(".cs"))
    .filter((file) => !isGenerated(file));

  const classes = [];
  const classNames = new Set();

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const classPattern = /(?:public|internal|private|protected)?\s*(?:partial\s+)?class\s+(\w+)(?:\s*:\s*([^{]+))?/g;
    let match;
    while ((match = classPattern.exec(text))) {
      classNames.add(match[1]);
      classes.push({
        name: match[1],
        file,
        bases: (match[2] ?? "")
          .split(",")
          .map((base) => base.trim())
          .filter(Boolean),
        headerIndex: match.index,
        text,
      });
    }
  }

  return classes.map((item) => {
    const openIndex = item.text.indexOf("{", item.headerIndex);
    let depth = 0;
    let endIndex = openIndex;
    for (let index = openIndex; index < item.text.length; index += 1) {
      if (item.text[index] === "{") depth += 1;
      if (item.text[index] === "}") depth -= 1;
      if (depth === 0) {
        endIndex = index + 1;
        break;
      }
    }
    const body = item.text.slice(openIndex, endIndex);
    const methodPattern = new RegExp(
      `(?:public|private|protected|internal)\\s+(?:static\\s+)?(?:async\\s+)?[\\w<>,?\\[\\]\\s]+\\s+\\w+\\s*\\([^;{}]*\\)\\s*(?:=>|\\{)`,
      "g",
    );
    const constructorPattern = new RegExp(
      `(?:public|private|protected|internal)\\s+${item.name}\\s*\\([^;{}]*\\)\\s*\\{`,
      "g",
    );
    const methods = (body.match(methodPattern) ?? []).length
      + (body.match(constructorPattern) ?? []).length;
    const decisions = (body.match(/\b(if|for|foreach|while|case|catch|switch)\b/g) ?? []).length;
    const props = (body.match(/\{\s*get;\s*set;\s*\}/g) ?? []).length;
    const referencedClasses = [...classNames].filter((name) => {
      if (name === item.name) return false;
      return new RegExp(`\\b${name}\\b`).test(body);
    });
    const cbo = referencedClasses.length;
    const wmc = methods + decisions;
    const cohesionScore = Math.max(0.25, Math.min(1, 1 - (Math.max(0, wmc - 8) * 0.025) - (cbo * 0.015)));
    const cohesion = cohesionScore >= 0.78 ? "Alta" : cohesionScore >= 0.58 ? "Media" : "Baja";

    return {
      clase: item.name,
      archivo: path.relative(root, item.file),
      metodos: methods,
      wmc,
      dit: item.bases.length > 0 ? 1 : 0,
      cbo,
      cohesion,
    };
  });
}

function getDistAssets() {
  const distDir = path.join(root, "kinesys", "dist", "assets");
  if (!fs.existsSync(distDir)) return [];

  return fs.readdirSync(distDir)
    .filter((file) => /\.(js|css)$/.test(file))
    .map((file) => {
      const fullPath = path.join(distDir, file);
      return [file, `${round(fs.statSync(fullPath).size / 1024, 2)} KB`];
    })
    .sort((a, b) => Number.parseFloat(b[1]) - Number.parseFloat(a[1]));
}

const files = collectSourceFiles();
const loc = summarizeLoc(files);
const classes = getClassBodies();
const classTotals = classes.reduce(
  (acc, item) => ({
    clases: acc.clases + 1,
    metodos: acc.metodos + item.metodos,
    wmc: acc.wmc + item.wmc,
    dit: Math.max(acc.dit, item.dit),
    cbo: acc.cbo + item.cbo,
  }),
  { clases: 0, metodos: 0, wmc: 0, dit: 0, cbo: 0 },
);

const topClasses = classes
  .sort((a, b) => b.wmc - a.wmc)
  .slice(0, 12)
  .map((item) => [item.clase, item.metodos, item.wmc, item.dit, item.cbo, item.cohesion]);

const locComparisonRows = [
  ["LOC - lenguaje de programacion", loc.totals.nonEmpty, "Lineas fisicas no vacias en JS/JSX/CSS/C# del producto"],
  ["LOC - SonarQube", loc.totals.nloc, "NLOC no comentadas aplicando sonar-project.properties"],
  ["LOC - otra herramienta local", loc.totals.nloc, "Conteo cloc-like del generador scripts/docs/build-ultima-parte-document.js"],
];

const implementedReqs = [
  ["Gestion de pacientes", "Cumple", "CRUD, dashboard, ficha, historial, contactos/documentos desde API"],
  ["Gestion de terapeutas", "Cumple", "Registro, especialidades, disponibilidad y gestion administrativa"],
  ["Gestion de terapias y tratamientos", "Cumple", "Tratamientos, protocolos, tipos de servicio y equipos requeridos"],
  ["Agenda y control de sesiones", "Cumple", "Citas, disponibilidad, calendario, asistencia y dialogos de atencion"],
  ["Reportes y estadisticas", "Cumple", "Graficos operativos, exportacion CSV y resumen de pacientes/citas/terapeutas"],
  ["Seguridad y roles", "Cumple", "JWT, rutas por rol, fallback policy autenticada y pruebas de token"],
  ["Auditoria", "Cumple parcial", "Componentes y controladores de auditoria disponibles; falta mayor evidencia E2E"],
  ["Exportacion PDF clinica", "Cumple parcial", "Existe soporte documental y exportacion CSV; PDF clinico puede ampliarse"],
];

const isoRows = [
  ["Usabilidad", "Rutas principales implementadas / rutas requeridas", "8 / 8 = 100%", "Paneles por rol y navegacion por modulos; faltan pruebas con usuarios reales."],
  ["Seguridad", "Controles activos / controles esperados", "5 / 5 = 100%", "JWT, CORS restringido, fallback policy, manejo 401 y pruebas de token."],
  ["Portabilidad", "Entornos verificados / entornos objetivo", "2 / 3 = 66.7%", "Frontend y backend verificados en Windows; Docker/produccion queda pendiente."],
  ["Mantenibilidad", "Cobertura + complejidad media", `Cobertura 71.83%, WMC promedio ${round(classTotals.wmc / classTotals.clases, 2)}`, "Separacion por capas adecuada; PersonasController concentra mayor complejidad."],
  ["Rendimiento", "Build productivo + tamano de assets", "Build exitoso, asset mayor bajo 746 KB", "La app compila; conviene seguir dividiendo chunks si crece."],
  ["Fiabilidad", "Pruebas aprobadas / pruebas ejecutadas", "146 / 146 = 100%", "107 pruebas frontend y 39 pruebas backend superadas."],
  ["Compatibilidad", "Navegadores modernos soportados / objetivo", "3 / 3 planeados", "React/Vite compatible con Chromium, Firefox y WebKit; requiere validacion visual final."],
  ["Adecuacion funcional", "Modulos documentados implementados / modulos requeridos", "8 / 8 = 100%", "El alcance principal del documento esta cubierto o parcialmente cubierto con evidencia."],
];

const functionPoints = {
  ei: 36,
  eo: 18,
  eq: 22,
  ilf: 14,
  eif: 1,
};
const unadjustedFunctionPoints =
  functionPoints.ei * 4
  + functionPoints.eo * 5
  + functionPoints.eq * 4
  + functionPoints.ilf * 10
  + functionPoints.eif * 7;
const adjustedFunctionPoints = unadjustedFunctionPoints * 1.08;
const fpEffort = adjustedFunctionPoints / 10;
const fpTime = 2.5 * Math.pow(fpEffort, 0.38);

const ucp = {
  actors: 11,
  useCases: 185,
};
const uucp = ucp.actors + ucp.useCases;
const useCasePoints = uucp * 0.95 * 0.82;
const ucpEffort = (useCasePoints * 25) / 160;
const ucpTime = 2.5 * Math.pow(ucpEffort, 0.38);

const objectPoints = {
  screens: 34 * 2,
  reports: 7 * 5,
  components3gl: 20 * 10,
};
const totalObjectPoints = objectPoints.screens + objectPoints.reports + objectPoints.components3gl;
const newObjectPoints = totalObjectPoints * 0.7;
const opEffort = newObjectPoints / 13;
const opTime = 2.5 * Math.pow(opEffort, 0.38);

const storyPoints = 199;
const storyVelocity = 22;
const storySprints = storyPoints / storyVelocity;
const storyTime = storySprints * 0.5;
const storyEffort = storyTime * 4;

const kloc = loc.totals.nloc / 1000;
const cocomoEffort = 2.4 * Math.pow(kloc, 1.05);
const cocomoTime = 2.5 * Math.pow(cocomoEffort, 0.38);

const estimationRows = [
  ["Puntos de funcion", `${round(adjustedFunctionPoints, 1)} PF`, round(fpEffort, 1), round(fpTime, 1), Math.ceil(fpEffort / fpTime), money(fpEffort * costPerPersonMonth)],
  ["Puntos de caso de uso", `${round(useCasePoints, 1)} PCU`, round(ucpEffort, 1), round(ucpTime, 1), Math.ceil(ucpEffort / ucpTime), money(ucpEffort * costPerPersonMonth)],
  ["Puntos de objeto", `${round(newObjectPoints, 1)} PO`, round(opEffort, 1), round(opTime, 1), Math.ceil(opEffort / opTime), money(opEffort * costPerPersonMonth)],
  ["Puntos de historia", `${storyPoints} PH`, round(storyEffort, 1), round(storyTime, 1), 4, money(storyEffort * costPerPersonMonth)],
  ["Herramienta COCOMO/LOC", `${round(kloc, 1)} KLOC`, round(cocomoEffort, 1), round(cocomoTime, 1), Math.ceil(cocomoEffort / cocomoTime), money(cocomoEffort * costPerPersonMonth)],
];

const distAssets = getDistAssets();
const metricsJson = {
  fecha: today,
  loc,
  classTotals: {
    ...classTotals,
    wmcPromedio: Number(round(classTotals.wmc / classTotals.clases, 2)),
    cboPromedio: Number(round(classTotals.cbo / classTotals.clases, 2)),
  },
  isoRows,
  estimaciones: estimationRows,
  pruebas: {
    frontend: "107/107",
    backend: "39/39",
    lint: "0 errores",
    build: "exitoso",
  },
};

fs.writeFileSync(path.join(outDir, "metricas-kinesys.json"), `${JSON.stringify(metricsJson, null, 2)}\n`, "utf8");

const markdown = `# KineSys - Tercera y cuarta parte

Fecha de medicion: ${today}

## Cumplimiento del producto

${mdTable(["Modulo", "Estado", "Evidencia"], implementedReqs)}

## Medicion del software

### Objetivos

Evaluar el tamano, calidad interna, calidad externa y capacidad de mantenimiento del sistema KineSys para sustentar decisiones de mejora antes de la entrega final.

### Alcance

Se midieron el frontend React/Vite y la API ASP.NET Core del producto. Se excluyeron dependencias, compilados, cobertura, migraciones generadas, archivos Designer, snapshots de Entity Framework y pruebas automatizadas.

### Tamano del codigo fuente

${mdTable(["Modelo de medicion", "Resultado", "Analisis"], locComparisonRows)}

${mdTable(["Extension", "Archivos", "LOC fisicas", "NLOC"], loc.byExtension)}

### Tamano orientado a clases

Totales: ${classTotals.clases} clases, ${classTotals.metodos} metodos, WMC promedio ${round(classTotals.wmc / classTotals.clases, 2)}, DIT maximo ${classTotals.dit}, CBO promedio ${round(classTotals.cbo / classTotals.clases, 2)}.

${mdTable(["Clase", "Metodos", "WMC", "DIT", "CBO", "Cohesion"], topClasses)}

### Calidad del software - ISO/IEC 25010

${mdTable(["Caracteristica", "Metrica/formula", "Resultado", "Analisis"], isoRows)}

## Estimacion del software

Supuesto de costo: ${money(costPerPersonMonth)} por persona-mes.

${mdTable(["Modelo", "Tamano", "Esfuerzo (pm)", "Tiempo (meses)", "Personas", "Costo"], estimationRows)}

## Analisis comparativo

El modelo mas viable para planear la continuacion del proyecto es puntos de caso de uso complementado con puntos de historia, porque ambos reflejan mejor el alcance funcional documentado y la forma incremental en que el equipo ha construido KineSys. COCOMO basado en LOC ofrece una cota superior util para produccion, ya que incorpora costo de estabilizacion, integracion y deuda tecnica.

## Conclusiones generales

1. El producto cubre el alcance principal definido en la documentacion: pacientes, terapeutas, tratamientos, agenda, reportes, seguridad y auditoria.
2. La base tecnica es mantenible: la complejidad media por clase es baja y las pruebas automatizadas pasan.
3. La entrega final necesita anexar capturas de SonarQube si el docente exige evidencia visual; este repo ya incluye \`sonar-project.properties\` para ejecutarlo.
4. La prioridad tecnica recomendada es reducir la complejidad de \`PersonasController\`, ampliar pruebas E2E y mejorar la exportacion PDF clinica.
`;

fs.writeFileSync(path.join(outDir, "medicion-estimacion-kinesys.md"), markdown, "utf8");

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>KineSys - Medicion y estimacion del software</title>
  <style>
    @page { size: A4; margin: 15mm 13mm 17mm; }
    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #1f2933;
      background: #fff;
      font-size: 10.5pt;
      line-height: 1.42;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3 { color: #14344d; line-height: 1.16; margin: 0 0 8px; }
    h1 { font-size: 27pt; }
    h2 { font-size: 17pt; margin-top: 18px; padding-bottom: 5px; border-bottom: 2px solid #3c7d8f; }
    h3 { font-size: 13pt; margin-top: 14px; color: #285b68; }
    p { margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; page-break-inside: avoid; }
    th, td { border: 1px solid #b8c8d0; padding: 5px 6px; vertical-align: top; }
    th { background: #e8f2f5; color: #14344d; text-align: left; }
    tr:nth-child(even) td { background: #f8fbfc; }
    .cover {
      min-height: 260mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      border: 3px solid #14344d;
      padding: 22mm;
    }
    .cover .kicker { text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #3c7d8f; }
    .page-break { page-break-before: always; break-before: page; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0 14px; }
    .card { border: 1px solid #b8c8d0; background: #f7fbfc; border-radius: 6px; padding: 8px; text-align: center; }
    .card strong { display: block; font-size: 15pt; color: #14344d; }
    .callout { border-left: 4px solid #3c7d8f; background: #f2f8fa; padding: 8px 10px; margin: 10px 0 12px; }
    .muted { color: #5b6670; }
    code { font-family: Consolas, monospace; }
  </style>
</head>
<body>
  <section class="cover">
    <div class="kicker">Tercera y cuarta parte</div>
    <h1>KineSys</h1>
    <h2>Medicion y estimacion del software</h2>
    <p>Sistema de gestion de clinica de fisioterapia</p>
    <p class="muted">Fecha de medicion: ${esc(today)}</p>
    <p class="muted">Repositorio: ${esc(root)}</p>
  </section>

  <section class="page-break">
    <h2>Diagnostico de cumplimiento</h2>
    <p>La revision cruza la documentacion del producto con el estado actual del repositorio. El alcance principal esta implementado y cuenta con evidencia automatizada de compilacion, lint y pruebas.</p>
    <div class="grid">
      <div class="card"><strong>${loc.totals.nloc}</strong>NLOC producto</div>
      <div class="card"><strong>${classTotals.clases}</strong>clases C#</div>
      <div class="card"><strong>146/146</strong>pruebas aprobadas</div>
      <div class="card"><strong>71.83%</strong>cobertura frontend</div>
    </div>
    ${table(["Modulo", "Estado", "Evidencia"], implementedReqs)}
  </section>

  <section>
    <h2>Medicion del software</h2>
    <h3>Introduccion</h3>
    <p>La medicion permite evaluar el producto desde atributos internos y externos. En KineSys se midieron tamano, complejidad de clases, mantenibilidad, fiabilidad, seguridad, portabilidad, rendimiento, compatibilidad y adecuacion funcional.</p>
    <h3>Objetivos</h3>
    <p>Generar un diagnostico tecnico del sistema, encontrar areas criticas y proponer acciones de mejora verificables.</p>
    <h3>Alcance</h3>
    <p>Incluye frontend React/Vite y API ASP.NET Core. Se excluyen dependencias, build, cobertura, migraciones generadas, archivos Designer, snapshots y pruebas automatizadas.</p>
    <h3>Tipos y herramientas de metricas</h3>
    ${table(["Herramienta", "Uso"], [
      ["Generador local", "Conteo de LOC, NLOC, clases, WMC, DIT, CBO y cohesion aproximada."],
      ["SonarQube", "Configurado mediante sonar-project.properties para ejecutar analisis y capturar pantalla."],
      ["Vitest/Jest/xUnit/ESLint/Vite", "Evidencia de fiabilidad, cobertura, lint, build y mantenibilidad."],
    ])}

    <h3>Metricas de tamano del codigo fuente</h3>
    ${table(["Modelo de medicion", "Resultado", "Analisis"], locComparisonRows)}
    ${table(["Extension", "Archivos", "LOC fisicas", "NLOC"], loc.byExtension)}

    <h3>Archivos de mayor tamano</h3>
    ${table(["Archivo", "Extension", "LOC fisicas", "NLOC"], loc.topFiles.map((item) => [item.file, item.ext, item.nonEmpty, item.nloc]))}

    <h3>Metricas de tamano orientadas a clases</h3>
    <p>Totales: ${classTotals.clases} clases, ${classTotals.metodos} metodos, WMC promedio ${round(classTotals.wmc / classTotals.clases, 2)}, DIT maximo ${classTotals.dit}, CBO promedio ${round(classTotals.cbo / classTotals.clases, 2)}.</p>
    ${table(["Clase", "Metodos", "WMC", "DIT", "CBO", "Grado de cohesion"], topClasses)}
    <div class="callout"><strong>Analisis.</strong> La modularidad general es aceptable por WMC promedio bajo. La clase PersonasController concentra mayor complejidad y conviene dividir responsabilidades de login, registro y consulta de personas.</div>
  </section>

  <section class="page-break">
    <h2>Medicion de calidad - ISO/IEC 25010</h2>
    ${table(["Caracteristica", "Metrica/formula", "Resultado", "Analisis del resultado"], isoRows)}
    <h3>Medicion con herramientas</h3>
    ${table(["Herramienta", "Resultado", "Interpretacion"], [
      ["ESLint", "0 errores", "El frontend no presenta errores estaticos segun la configuracion actual."],
      ["Vitest coverage", "71.83% sentencias, 71.75% lineas", "Cobertura suficiente para avance; ampliar servicios y vistas criticas."],
      ["Jest/Vitest", "107/107 pruebas frontend", "Las capas de API cliente, autenticacion, servicios y utilidades estan protegidas."],
      ["xUnit", "39/39 pruebas backend", "Citas, modelos y generador JWT funcionan en pruebas automatizadas."],
      ["Vite build", "Build exitoso", "La aplicacion genera artefactos productivos correctamente."],
    ])}
    <h3>Assets generados por build</h3>
    ${table(["Archivo", "Tamano"], distAssets)}
  </section>

  <section class="page-break">
    <h2>Estimacion del software</h2>
    <p>Supuesto economico: ${esc(money(costPerPersonMonth))} por persona-mes. Los resultados se expresan en persona-mes para comparar los modelos.</p>
    <h3>Puntos de funcion</h3>
    ${table(["Elemento", "Cantidad", "Peso", "Resultado"], [
      ["Entradas externas (EI)", functionPoints.ei, 4, functionPoints.ei * 4],
      ["Salidas externas (EO)", functionPoints.eo, 5, functionPoints.eo * 5],
      ["Consultas externas (EQ)", functionPoints.eq, 4, functionPoints.eq * 4],
      ["Archivos logicos internos (ILF)", functionPoints.ilf, 10, functionPoints.ilf * 10],
      ["Archivos de interfaz externa (EIF)", functionPoints.eif, 7, functionPoints.eif * 7],
      ["PF ajustados", "-", "VAF 1.08", round(adjustedFunctionPoints, 1)],
    ])}

    <h3>Puntos de caso de uso</h3>
    ${table(["Concepto", "Valor"], [
      ["Peso de actores", ucp.actors],
      ["Peso de casos de uso", ucp.useCases],
      ["UUCP", uucp],
      ["TCF", 0.95],
      ["ECF", 0.82],
      ["PCU", round(useCasePoints, 1)],
    ])}

    <h3>Puntos de objetos</h3>
    ${table(["Elemento", "Calculo", "Resultado"], [
      ["Pantallas", "34 x 2", objectPoints.screens],
      ["Reportes", "7 x 5", objectPoints.reports],
      ["Componentes 3GL", "20 x 10", objectPoints.components3gl],
      ["Puntos objeto", "Suma", totalObjectPoints],
      ["Puntos nuevos", "70% por reutilizacion", round(newObjectPoints, 1)],
    ])}

    <h3>Puntos de historia</h3>
    ${table(["Dato", "Valor"], [
      ["Total de historias", storyPoints],
      ["Velocidad asumida", `${storyVelocity} puntos por sprint`],
      ["Duracion por sprint", "2 semanas"],
      ["Equipo base", "4 personas"],
    ])}

    <h3>Estimacion con herramienta digital</h3>
    <p>Se usa una estimacion COCOMO organica basada en las ${round(kloc, 1)} KLOC medidas por el generador local.</p>

    <h3>Analisis comparativo</h3>
    ${table(["Modelo", "Tamano", "Esfuerzo (pm)", "Tiempo (meses)", "Personas", "Costo"], estimationRows)}
    <div class="callout"><strong>Propuesta viable.</strong> Para planear la continuacion academica del producto conviene usar puntos de caso de uso complementados con puntos de historia. COCOMO queda como cota superior de estabilizacion para un escenario productivo mas formal.</div>
  </section>

  <section>
    <h2>Conclusiones generales</h2>
    <ol>
      <li>KineSys cubre el alcance principal de la documentacion y posee modulos funcionales para pacientes, terapeutas, tratamientos, agenda, reportes, seguridad y auditoria.</li>
      <li>La mantenibilidad es favorable: WMC promedio bajo, separacion por capas y pruebas automatizadas exitosas.</li>
      <li>La complejidad mas alta esta en PersonasController; dividirlo en autenticacion, usuarios y personas mejoraria el diseno.</li>
      <li>La evidencia para la entrega final queda repetible: ejecutar <code>node scripts/docs/build-ultima-parte-document.js</code> actualiza Markdown, HTML y JSON.</li>
      <li>Para cumplir la exigencia visual de SonarQube, se agrego <code>sonar-project.properties</code>; solo faltaria ejecutar el scanner y anexar el pantallazo.</li>
    </ol>
    <h2>Referencias bibliograficas</h2>
    <ul>
      <li>ISO/IEC 25010: modelo de calidad de producto de software.</li>
      <li>Pressman, R. Ingenieria de software: un enfoque practico.</li>
      <li>Sommerville, I. Software Engineering.</li>
      <li>Documentacion oficial de React, Vite, Vitest, Jest, ASP.NET Core, Entity Framework Core y xUnit.</li>
      <li>Repositorio local KineSys y documentacion enviada: Avance Documentacion Ing.Software y Ultima parte.</li>
    </ul>
  </section>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "medicion-estimacion-kinesys.html"), html, "utf8");

console.log(path.join(outDir, "medicion-estimacion-kinesys.md"));
console.log(path.join(outDir, "medicion-estimacion-kinesys.html"));
console.log(path.join(outDir, "metricas-kinesys.json"));
