# Guia paso a paso - Pruebas de Seguridad ISO/IEC 25010 en KineSys

Este documento esta pensado para explicar las pruebas en clase de forma simple.

La idea no es solo ejecutar comandos. La idea es decir:

1. Que herramienta uso.
2. Que subcaracteristica de seguridad evalua.
3. En que parte del proyecto se ejecuta.
4. Que significa el resultado.

## Resumen rapido

| Paso | Herramienta | Que revisa | Subcaracteristica ISO 25010 |
|---|---|---|---|
| 1 | `npm audit` en la raiz | Dependencias JavaScript generales | Confidencialidad e integridad |
| 2 | `npm audit` en frontend | Dependencias del frontend React | Confidencialidad e integridad |
| 3 | Jest | Pruebas del frontend: login, token, servicios | Autenticidad e integridad |
| 4 | Vite build | Que el frontend compile despues de los cambios | Apoyo a integridad del producto |
| 5 | ESLint | Errores de codigo y malas practicas | Apoyo a integridad del producto |
| 6 | NuGet audit | Dependencias .NET del backend | Confidencialidad e integridad |
| 7 | xUnit / `dotnet test` | Pruebas del backend: reglas, JWT, roles | Autenticidad e integridad |
| 8 | PowerShell | Controladores sin autorizacion | Confidencialidad y autenticidad |
| 9 | PowerShell / Semgrep | Secretos JWT escritos en el codigo | Confidencialidad y autenticidad |
| 10 | PowerShell / Semgrep | Exposicion de `Password` en respuestas | Confidencialidad |
| 11 | Swagger/Postman/PowerShell | Endpoint protegido sin token | Confidencialidad y autenticidad |
| 12 | Swagger/Postman + Auditorias | Registro de acciones de usuarios | Responsabilidad y no repudio |
| 13 | OWASP ZAP | Analisis dinamico de la app ejecutandose | Confidencialidad, integridad y autenticidad |

## Antes de empezar

Abrir PowerShell y ubicarse en la raiz del proyecto:

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys
```

Frase para decir:

> Todas las pruebas se ejecutan desde el proyecto KineSys. Algunas son para el frontend, otras para el backend y otras para revisar seguridad general.

---

## Paso 1 - Revisar dependencias JavaScript de la raiz

### Herramienta

`npm audit`

### Subcaracteristica que evalua

Confidencialidad e integridad.

### Por que se hace aqui

Se ejecuta en la raiz porque ahi existe un `package.json` general del proyecto.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys
```

```powershell
npm audit --audit-level=moderate
```

### Resultado esperado

```text
found 0 vulnerabilities
```

### Que significa

Significa que las dependencias JavaScript de la raiz no tienen vulnerabilidades conocidas de nivel moderado, alto o critico.

### Que decir en la exposicion

> Esta prueba evalua confidencialidad e integridad porque una libreria vulnerable podria permitir fuga de datos o modificacion indebida del sistema. En este caso el resultado es correcto porque npm reporta cero vulnerabilidades.

---

## Paso 2 - Revisar dependencias JavaScript del frontend

### Herramienta

`npm audit`

### Subcaracteristica que evalua

Confidencialidad e integridad.

### Por que se hace aqui

Se ejecuta dentro de `kinesys` porque ese es el frontend React/Vite del proyecto.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\kinesys
```

```powershell
npm audit --audit-level=moderate
```

### Resultado esperado

```text
found 0 vulnerabilities
```

### Que significa

Significa que las librerias del frontend no tienen vulnerabilidades conocidas reportadas por npm.

### Que decir en la exposicion

> Esta prueba revisa la seguridad de las librerias del frontend. Es importante porque el frontend maneja token, formularios y datos de usuario. Si una libreria del frontend tiene una vulnerabilidad, podria afectar la confidencialidad o integridad de la informacion.

---

## Paso 3 - Ejecutar pruebas del frontend

### Herramienta

Jest

### Subcaracteristica que evalua

Autenticidad e integridad.

### Por que se hace aqui

Se ejecuta en el frontend porque ahi estan las pruebas de login, contexto de autenticacion, token JWT, cliente API y servicios.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\kinesys
```

```powershell
npm run test:jest -- --silent
```

### Resultado esperado

```text
Test Suites: 10 passed, 10 total
Tests:       107 passed, 107 total
```

### Que significa

Significa que las pruebas automaticas del frontend pasaron correctamente.

### Que decir en la exposicion

> Esta prueba apoya autenticidad porque revisa partes relacionadas con login, token y proteccion de rutas. Tambien apoya integridad porque confirma que los servicios y reglas del frontend siguen funcionando despues de las correcciones.

---

## Paso 4 - Compilar el frontend

### Herramienta

Vite

### Subcaracteristica que evalua

No evalua directamente una subcaracteristica de seguridad. Sirve como verificacion de apoyo a la integridad del producto.

### Por que se hace aqui

Se ejecuta en `kinesys` porque ahi esta el frontend.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\kinesys
```

```powershell
npm run build
```

### Resultado esperado

```text
✓ built
```

### Que significa

Si aparece `built`, el frontend compilo correctamente. En esta version el build ya queda sin advertencias de SignalR ni de tamano de chunks.

### Que decir en la exposicion

> Esta prueba no demuestra por si sola seguridad, pero confirma que las correcciones aplicadas no rompieron el frontend. Por eso la usamos como prueba de apoyo a la integridad del producto.

---

## Paso 5 - Revisar errores de codigo en frontend

### Herramienta

ESLint

### Subcaracteristica que evalua

No evalua directamente una subcaracteristica de seguridad. Sirve como verificacion de apoyo a la integridad del producto.

### Por que se hace aqui

Se ejecuta en el frontend porque revisa el codigo React.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\kinesys
```

```powershell
npm run lint
```

### Resultado esperado

Debe terminar sin listar problemas. Es decir, sin errores y sin advertencias.

### Que significa

Significa que no hay errores ni advertencias de lint pendientes.

### Que decir en la exposicion

> ESLint no reemplaza una herramienta de seguridad, pero ayuda a detectar errores de codigo. En este caso el resultado es limpio porque no imprime errores ni advertencias.

---

## Paso 6 - Revisar dependencias .NET del backend

### Herramienta

`dotnet package list --vulnerable`

### Subcaracteristica que evalua

Confidencialidad e integridad.

### Por que se hace aqui

Se ejecuta en `api` porque ahi esta la solucion .NET del backend.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\api
```

```powershell
dotnet package list --project .\ApiPrueba.sln --vulnerable --include-transitive
```

Si alguien usa una version anterior de .NET, puede usar:

```powershell
dotnet list .\ApiPrueba.sln package --vulnerable --include-transitive
```

### Resultado esperado

```text
El proyecto "ApiPrueba" especificado no tiene paquetes vulnerables en los origenes actuales.
El proyecto "ApiPrueba.Tests" especificado no tiene paquetes vulnerables en los origenes actuales.
```

### Que significa

Significa que los paquetes NuGet del backend y sus dependencias transitivas no tienen vulnerabilidades conocidas en los origenes consultados.

### Que decir en la exposicion

> Esta prueba evalua confidencialidad e integridad porque el backend procesa datos sensibles. Si un paquete .NET tuviera una vulnerabilidad, podria comprometer datos o permitir alteraciones indebidas.

---

## Paso 7 - Ejecutar pruebas del backend

### Herramienta

xUnit con `dotnet test`

### Subcaracteristica que evalua

Autenticidad e integridad.

### Por que se hace aqui

Se ejecuta en la API porque ahi estan las pruebas del backend.

### Comando

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\api
```

```powershell
dotnet test .\ApiPrueba.sln
```

### Resultado esperado

```text
Resumen de pruebas: total: 39; con errores: 0; correcto: 39; omitido: 0
```

### Que significa

Significa que las pruebas automaticas del backend pasaron.

### Que decir en la exposicion

> Esta prueba apoya autenticidad porque valida reglas relacionadas con usuarios, roles y token. Tambien apoya integridad porque confirma que la logica del backend responde como se espera.

---

## Paso 8 - Verificar que los controladores esten protegidos

### Herramienta

PowerShell revisando archivos `.cs`

### Subcaracteristica que evalua

Confidencialidad y autenticidad.

### Por que se hace aqui

Se ejecuta desde la raiz porque revisa todos los controladores del backend.

### Comando 1

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys
```

### Comando 2

```powershell
$controllers = Get-ChildItem api\ApiPrueba\Controllers -Filter *.cs
```

### Comando 3

```powershell
$without = @($controllers | Where-Object { (Get-Content -Raw $_.FullName) -notmatch '\[Authorize|AuthorizeByRole' })
```

### Comando 4

```powershell
"Total controllers: $($controllers.Count)"
```

### Comando 5

```powershell
"Without auth attributes: $($without.Count)"
```

### Resultado esperado

```text
Total controllers: 35
Without auth attributes: 0
```

### Que significa

Significa que todos los controladores tienen una proteccion explicita con `[Authorize]` o `AuthorizeByRole`.

### Que decir en la exposicion

> Esta prueba evalua confidencialidad y autenticidad. Confidencialidad porque evita que datos sensibles queden publicos. Autenticidad porque obliga a que el usuario este identificado antes de usar endpoints protegidos.

---

## Paso 9 - Verificar que no exista la clave JWT vieja en el codigo

### Herramienta

PowerShell con `Select-String`

### Subcaracteristica que evalua

Confidencialidad y autenticidad.

### Por que se hace aqui

Se ejecuta en el backend porque el JWT se firma desde la API.

### Comando 1

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys
```

### Comando 2

```powershell
Get-ChildItem .\api\ApiPrueba -Recurse -Include *.cs,*.json |
  Select-String -Pattern 'ClaveDeAcceso_ParaAccederTokens_2025'
```

### Comando 3

```powershell
Select-String -Path .\api\ApiPrueba\appsettings.json -Pattern '"Key"'
```

### Resultado esperado

No debe imprimir coincidencias.

### Que significa

Significa que la clave JWT no quedo escrita directamente en el repositorio.

### Que decir en la exposicion

> Esta prueba evalua confidencialidad porque un secreto escrito en el codigo puede filtrarse. Tambien evalua autenticidad porque si alguien conoce la clave JWT podria intentar falsificar tokens.

---

## Paso 10 - Verificar que la API no devuelva Password

### Herramienta

PowerShell con `Select-String`

### Subcaracteristica que evalua

Confidencialidad.

### Por que se hace aqui

Se ejecuta en controladores y modelos porque ahi se definen las respuestas de la API.

### Comando 1

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys
```

### Comando 2

```powershell
Get-ChildItem .\api\ApiPrueba\Controllers,.\api\ApiPrueba\Models -Recurse -Include *.cs |
  Select-String -Pattern 'p\.Password|Password,'
```

### Resultado esperado

No debe mostrar `p.Password` en respuestas.

### Que significa

Significa que la API no esta enviando contrasenas ni hashes de contrasenas cuando consulta usuarios.

### Que decir en la exposicion

> Esta prueba evalua confidencialidad porque una contrasena, incluso cifrada o hasheada, no debe devolverse en una respuesta de la API.

---

## Paso 11 - Probar un endpoint protegido sin token

### Herramienta

PowerShell, Swagger o Postman

### Subcaracteristica que evalua

Confidencialidad y autenticidad.

### Por que se hace aqui

Se ejecuta contra la API funcionando porque necesitamos comprobar el comportamiento real del sistema.

### Terminal 1 - levantar la API

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\api\ApiPrueba
```

```powershell
dotnet run --launch-profile http
```

### Terminal 2 - pedir datos sin token

```powershell
try {
  Invoke-WebRequest -Uri http://localhost:5058/api/Citas -UseBasicParsing
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

### Resultado esperado

```text
401
```

### Que significa

`401 Unauthorized` significa que el sistema rechazo la peticion porque no habia token.

### Que decir en la exposicion

> Esta prueba evalua autenticidad porque el sistema exige que el usuario demuestre quien es mediante un token. Tambien evalua confidencialidad porque evita que una persona anonima consulte datos protegidos.

---

## Paso 12 - Probar login y token JWT

### Herramienta

Swagger, Postman o PowerShell

### Subcaracteristica que evalua

Autenticidad.

### Por que se hace aqui

Se ejecuta contra la API porque el login y la generacion del token ocurren en el backend.

### En Swagger

Abrir:

```text
http://localhost:5058/swagger
```

Ejecutar:

```text
POST /api/Personas/Login
```

Con un usuario real de la base de datos.

### Resultado esperado

```json
{
  "id": 1,
  "nombres": "...",
  "apellidos": "...",
  "token": "eyJ..."
}
```

### Que significa

Significa que el sistema valido credenciales y genero un token JWT.

### Que decir en la exposicion

> Esta prueba evalua autenticidad porque confirma que el sistema identifica al usuario y le entrega un token firmado para acceder a los recursos protegidos.

---

## Paso 13 - Verificar auditoria

### Herramienta

Swagger, Postman o consulta a la base de datos

### Subcaracteristica que evalua

Responsabilidad y no repudio.

### Por que se hace aqui

La auditoria sirve para saber quien hizo una accion, cuando la hizo y desde donde.

### Que revisar

En el sistema debe existir evidencia con datos como:

```text
IdPersona
NombreUsuario
FechaHora
DireccionIP
Accion
Entidad
Exitoso
```

### Prueba sugerida

1. Iniciar sesion con un usuario real.
2. Crear, editar o eliminar un dato importante.
3. Consultar auditorias desde Swagger/Postman o desde la base de datos.
4. Verificar que exista un registro de esa accion.

### Resultado esperado

Debe existir un registro que indique:

```text
quien hizo la accion
que accion hizo
cuando la hizo
desde que IP
si fue exitosa o no
```

### Que significa

Si existe ese registro, se puede atribuir una accion a un usuario.

### Que decir en la exposicion

> Esta prueba evalua responsabilidad porque permite saber que usuario realizo una accion. Tambien evalua no repudio porque el usuario no puede negar facilmente una accion si queda evidencia con fecha, identidad, IP y resultado.

---

## Paso 14 - Ejecutar OWASP ZAP

### Herramienta

OWASP ZAP

### Subcaracteristica que evalua

Confidencialidad, integridad y autenticidad.

### Por que se hace aqui

ZAP analiza la aplicacion ejecutandose, como si fuera una prueba externa.

### Primero levantar API

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\api\ApiPrueba
```

```powershell
dotnet run --launch-profile http
```

### Luego levantar frontend

En otra terminal:

```powershell
cd C:\Users\carde\Documents\ProgramacionMovil\KineSys\kinesys
```

```powershell
npm run dev
```

### Opcion con ZAP Desktop

1. Abrir OWASP ZAP.
2. Ir a `Quick Start`.
3. Elegir `Automated Scan`.
4. Colocar:

```text
http://localhost:5173
```

5. Ejecutar el analisis.
6. Para la API, importar:

```text
http://localhost:5058/swagger/v1/swagger.json
```

### Resultado esperado

El reporte no deberia mostrar alertas `High` o `Critical`.

### Que significa

ZAP revisa problemas comunes desde afuera: endpoints expuestos, headers inseguros, CORS, XSS y posibles inyecciones.

### Que decir en la exposicion

> ZAP evalua la aplicacion en ejecucion. A diferencia de npm audit o Semgrep, no revisa solo archivos: prueba el comportamiento real de la aplicacion como lo haria un atacante controlado.

---

## Flujo recomendado para explicar en clase

### 1. Primero revisamos dependencias

Herramientas:

```text
npm audit
dotnet package list --vulnerable
```

Subcaracteristicas:

```text
Confidencialidad e integridad
```

Frase:

> Revisamos dependencias porque una libreria vulnerable puede filtrar informacion o permitir alteraciones del sistema.

### 2. Luego revisamos pruebas automaticas

Herramientas:

```text
Jest
xUnit
```

Subcaracteristicas:

```text
Autenticidad e integridad
```

Frase:

> Las pruebas automaticas verifican que login, token, servicios y reglas del backend sigan funcionando correctamente.

### 3. Despues revisamos proteccion de endpoints

Herramientas:

```text
PowerShell
Swagger
Postman
```

Subcaracteristicas:

```text
Confidencialidad y autenticidad
```

Frase:

> Aqui comprobamos que los controladores esten protegidos y que una persona sin token reciba 401 Unauthorized.

### 4. Luego revisamos secretos y datos sensibles

Herramientas:

```text
PowerShell
Semgrep
```

Subcaracteristicas:

```text
Confidencialidad y autenticidad
```

Frase:

> Buscamos que no haya claves JWT escritas en el codigo y que la API no devuelva Password en sus respuestas.

### 5. Finalmente revisamos auditoria

Herramientas:

```text
Swagger
Postman
Base de datos
```

Subcaracteristicas:

```text
Responsabilidad y no repudio
```

Frase:

> La auditoria permite demostrar quien hizo una accion, cuando la hizo y si fue exitosa. Eso permite responsabilidad y no repudio.

## Cierre corto para la exposicion

> En conclusion, no usamos una sola herramienta para toda la caracteristica de seguridad. Para ISO 25010 se combinan varias herramientas: `npm audit` y NuGet para dependencias, Jest y xUnit para pruebas, PowerShell y Semgrep para revisar codigo, Swagger o Postman para comprobar autenticacion, auditorias para responsabilidad y no repudio, y OWASP ZAP para analizar la aplicacion en ejecucion.

> En KineSys los resultados principales fueron correctos: cero vulnerabilidades en npm, cero vulnerabilidades en NuGet, 107 pruebas del frontend aprobadas, 39 pruebas del backend aprobadas, 35 controladores protegidos y cero controladores sin autorizacion.
