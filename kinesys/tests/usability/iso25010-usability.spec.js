import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const accessibilityTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

function ratioMetric({ code, name, subcharacteristic, aLabel, bLabel, evidence }) {
  return {
    code,
    name,
    subcharacteristic,
    formula: "X = A / B",
    aLabel,
    bLabel,
    evidence,
    checks: [],
  }
}

function inverseMetric({ code, name, subcharacteristic, aLabel, bLabel, evidence }) {
  return {
    code,
    name,
    subcharacteristic,
    formula: "X = 1 - (A / B)",
    aLabel,
    bLabel,
    evidence,
    checks: [],
  }
}

function addMetricCheck(metric, label, passed, observation) {
  metric.checks.push({ label, passed, observation })
}

function calculateMetric(metric) {
  const b = metric.checks.length

  if (metric.formula === "X = 1 - (A / B)") {
    const a = metric.checks.filter((check) => !check.passed).length
    return { a, b, x: b === 0 ? null : 1 - a / b }
  }

  const a = metric.checks.filter((check) => check.passed).length
  return { a, b, x: b === 0 ? null : a / b }
}

function formatScore(score) {
  return score === null ? "N/A" : score.toFixed(2)
}

function buildMetricSummary(metrics) {
  const summaryRows = metrics.map((metric) => {
    const result = calculateMetric(metric)
    return `| ${metric.code} | ${metric.subcharacteristic} | ${metric.formula} | ${result.a} | ${result.b} | ${formatScore(result.x)} | ${metric.name} |`
  })

  const metricDetails = metrics.flatMap((metric) => {
    const result = calculateMetric(metric)
    return [
      `## ${metric.code} - ${metric.name}`,
      "",
      `- Subcaracteristica: ${metric.subcharacteristic}`,
      `- Formula: \`${metric.formula}\``,
      `- A: ${metric.aLabel} = ${result.a}`,
      `- B: ${metric.bLabel} = ${result.b}`,
      `- X: ${formatScore(result.x)}`,
      `- Evidencia: ${metric.evidence}`,
      "",
      "| Criterio medido | Cumple | Observacion |",
      "| --- | --- | --- |",
      ...metric.checks.map((check) => `| ${check.label} | ${check.passed ? "Si" : "No"} | ${check.observation} |`),
      "",
    ]
  })

  return [
    "# Metricas ISO/IEC 25010 - prueba USAB-ISO-001",
    "",
    "## Resumen",
    "",
    "| Metrica | Subcaracteristica | Formula | A | B | X | Nombre |",
    "| --- | --- | --- | ---: | ---: | ---: | --- |",
    ...summaryRows,
    "",
    "La estetica `UIn-1-S` se calcula despues con usuarios sobre las interfaces documentadas en Storybook.",
    "",
    ...metricDetails,
  ].join("\n")
}

async function attachMetricSummary(metrics) {
  const summary = buildMetricSummary(metrics)
  const json = metrics.map((metric) => ({ ...metric, result: calculateMetric(metric) }))

  await test.info().attach("metricas-iso25010.md", {
    body: summary,
    contentType: "text/markdown",
  })
  await test.info().attach("metricas-iso25010.json", {
    body: JSON.stringify(json, null, 2),
    contentType: "application/json",
  })

  for (const metric of metrics) {
    const result = calculateMetric(metric)
    test.info().annotations.push({
      type: metric.code,
      description: `${metric.name}: ${metric.formula}; A=${result.a}; B=${result.b}; X=${formatScore(result.x)}`,
    })
  }

  console.log("\nMetricas ISO/IEC 25010 - USAB-ISO-001\n")
  console.log(summary)
}

async function expectNoAccessibilityViolations(page, attachmentName) {
  const results = await new AxeBuilder({ page }).withTags(accessibilityTags).analyze()

  await test.info().attach(attachmentName, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: "application/json",
  })

  expect(results.violations, "La auditoria automatica de accesibilidad encontro violaciones WCAG").toEqual([])
}

test("ISO 25010 | usabilidad de primer contacto Home -> Login", async ({ page }) => {
  test.setTimeout(60000)
  let loginRequests = 0
  const passwordInput = page.locator("#contrasena")
  const metrics = [
    ratioMetric({
      code: "UAp-3-S",
      name: "Autodescripcion del punto de entrada",
      subcharacteristic: "Reconocibilidad de la adecuacion",
      aLabel: "Senales de proposito encontradas",
      bLabel: "Senales de proposito esperadas",
      evidence: "Home debe decir que KineSys gestiona clinicas de fisioterapia y sus funciones principales.",
    }),
    ratioMetric({
      code: "ULe-4-S",
      name: "Interfaz de usuario autoexplicativa",
      subcharacteristic: "Aprendizabilidad",
      aLabel: "Controles esenciales identificables",
      bLabel: "Controles esenciales esperados",
      evidence: "Login debe exponer etiquetas y accion principal sin ayuda externa.",
    }),
    ratioMetric({
      code: "ULe-3-S",
      name: "Comprension del mensaje de error - evidencia automatizada",
      subcharacteristic: "Aprendizabilidad",
      aLabel: "Mensajes de error visibles y especificos",
      bLabel: "Mensajes de error probados",
      evidence: "La automatizacion verifica visibilidad del mensaje; la comprension final se valida con usuarios.",
    }),
    inverseMetric({
      code: "UOp-1-G",
      name: "Consistencia de tareas interactivas",
      subcharacteristic: "Operabilidad",
      aLabel: "Tareas interactivas incoherentes detectadas",
      bLabel: "Tareas interactivas revisadas",
      evidence: "Flujo operativo Home -> Login por teclado y controles visibles.",
    }),
    ratioMetric({
      code: "UEp-1-G",
      name: "Evitar errores",
      subcharacteristic: "Proteccion contra errores de usuario",
      aLabel: "Errores prevenidos",
      bLabel: "Errores probados para prevencion",
      evidence: "El login no debe enviarse cuando usuario y contrasena estan vacios.",
    }),
    ratioMetric({
      code: "UEp-2-S",
      name: "Correccion de errores",
      subcharacteristic: "Proteccion contra errores de usuario",
      aLabel: "Errores con sugerencia de valor correcto",
      bLabel: "Errores de entrada detectados",
      evidence: "La diapositiva define esta metrica por sugerencias correctivas, no solo por mostrar un error.",
    }),
    ratioMetric({
      code: "UAc-1-G",
      name: "Accesibilidad para usuarios con discapacidad",
      subcharacteristic: "Accesibilidad",
      aLabel: "Vistas sin violaciones axe",
      bLabel: "Vistas auditadas",
      evidence: "Auditoria WCAG automatizada con axe sobre Home y Login.",
    }),
  ]
  const byCode = Object.fromEntries(metrics.map((metric) => [metric.code, metric]))

  await page.route("**/Personas/Login", async (route) => {
    loginRequests += 1
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Credenciales invalidas" }),
    })
  })

  try {
    await test.step("UAp: el punto de entrada describe para que sirve KineSys", async () => {
      await page.goto("/", { waitUntil: "domcontentloaded" })

      await expect(page.getByRole("heading", { name: /sistema de gesti.n para cl.nicas de fisioterapia/i })).toBeVisible()
      addMetricCheck(byCode["UAp-3-S"], "Titulo describe el tipo de sistema", true, "Titulo visible en Home.")

      await expect(page.getByText(/administra pacientes, terapeutas, citas y tratamientos/i)).toBeVisible()
      addMetricCheck(
        byCode["UAp-3-S"],
        "Texto enumera funciones principales",
        true,
        "Home menciona pacientes, terapeutas, citas y tratamientos.",
      )

      await page.screenshot({
        path: test.info().outputPath("01-home-reconocibilidad.png"),
        fullPage: true,
      })
    })

    await test.step("UAc: Home no presenta violaciones WCAG automatizadas", async () => {
      await expectNoAccessibilityViolations(page, "axe-home-violations.json")
      addMetricCheck(byCode["UAc-1-G"], "Home auditado con axe", true, "Sin violaciones axe WCAG automatizadas.")
    })

    await test.step("UOp y ULe: la navegacion y el inicio de sesion son reconocibles por teclado", async () => {
      const startSession = page.locator("section").getByRole("link", { name: /iniciar sesi.n/i })

      await startSession.focus()
      await expect(startSession).toBeFocused()
      addMetricCheck(byCode["UOp-1-G"], "Acceso a Iniciar sesion enfocable", true, "El enlace recibe foco.")

      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/\/login$/)
      addMetricCheck(byCode["UOp-1-G"], "Navegacion por teclado hacia Login", true, "Enter abre la ruta /login.")

      await expect(page.getByRole("heading", { name: /bienvenido/i })).toBeVisible()
      addMetricCheck(byCode["UOp-1-G"], "Login confirma el cambio de vista", true, "Encabezado Bienvenido visible.")

      await expect(page.getByLabel(/usuario/i)).toBeVisible()
      addMetricCheck(byCode["ULe-4-S"], "Campo Usuario identificable", true, "Etiqueta Usuario visible.")

      await expect(passwordInput).toBeVisible()
      addMetricCheck(byCode["ULe-4-S"], "Campo Contrasena identificable", true, "Campo de contrasena visible.")

      await expect(page.getByRole("button", { name: /ingresar/i })).toBeVisible()
      addMetricCheck(byCode["ULe-4-S"], "Accion Ingresar identificable", true, "Boton Ingresar visible.")

      await page.screenshot({
        path: test.info().outputPath("02-login-operabilidad.png"),
        fullPage: true,
      })
    })

    await test.step("UAc: Login no presenta violaciones WCAG automatizadas", async () => {
      await expectNoAccessibilityViolations(page, "axe-login-violations.json")
      addMetricCheck(byCode["UAc-1-G"], "Login auditado con axe", true, "Sin violaciones axe WCAG automatizadas.")
    })

    await test.step("UEp: el formulario evita envio vacio y comunica error de credenciales", async () => {
      await page.getByRole("button", { name: /ingresar/i }).click()

      await expect.poll(() => loginRequests).toBe(0)
      await expect(page.getByLabel(/usuario/i)).toHaveJSProperty("validity.valueMissing", true)
      await expect(passwordInput).toHaveJSProperty("validity.valueMissing", true)
      addMetricCheck(byCode["UEp-1-G"], "Envio vacio bloqueado", true, "No se envia la solicitud de login.")

      await page.getByLabel(/usuario/i).fill("usuario_prueba")
      await passwordInput.fill("clave_incorrecta")
      await page.getByRole("button", { name: /ingresar/i }).click()

      await expect.poll(() => loginRequests).toBe(1)
      await expect(page.getByText(/credenciales inv.lidas/i)).toBeVisible()
      addMetricCheck(byCode["ULe-3-S"], "Mensaje de credenciales invalidas visible", true, "La interfaz muestra el error recibido.")
      addMetricCheck(
        byCode["UEp-2-S"],
        "Credenciales invalidas detectadas",
        false,
        "El error se comunica, pero no sugiere un valor correcto como exige UEp-2-S.",
      )
    })
  } finally {
    await attachMetricSummary(metrics)
  }
})
