# KineSys

KineSys es un sistema web para la gestion de una clinica de fisioterapia. El proyecto integra frontend React/Vite, API ASP.NET Core, Entity Framework Core, SQL Server, autenticacion JWT, SignalR, pruebas automatizadas y artefactos academicos de documentacion.

## Estructura

- `kinesys/`: frontend React/Vite.
- `kinesys/src/README.md`: detalle de la organizacion interna del frontend.
- `api/ApiPrueba/`: API ASP.NET Core.
- `api/ApiPrueba.Tests/`: pruebas xUnit del backend.
- `artifacts/`: documentos generados, evidencias de pruebas y capturas.
- `scripts/docs/`: generadores de documentos academicos y reportes.
- `docs/ESTRUCTURA.md`: guia de organizacion interna del repositorio.
- `sonar-project.properties`: configuracion base para SonarQube.

## Ejecucion local

Frontend:

```bash
cd kinesys
npm install
npm run dev
```

Backend:

```bash
cd api
dotnet test ApiPrueba.sln
dotnet run --project ApiPrueba/ApiPrueba.csproj
```

Build y pruebas del frontend:

```bash
cd kinesys
npm run lint
npm test
npm run test:coverage
npm run build
```

## Entrega "Ultima parte"

La tercera y cuarta parte solicitadas en `Ultima parte.docx` se generan desde la raiz:

```bash
node scripts/docs/build-ultima-parte-document.js
```

Salidas:

- `artifacts/documentos/ultima-parte/medicion-estimacion-kinesys.md`
- `artifacts/documentos/ultima-parte/medicion-estimacion-kinesys.html`
- `artifacts/documentos/ultima-parte/metricas-kinesys.json`

Para anexar evidencia de SonarQube:

```bash
sonar-scanner
```

El scanner usa `sonar-project.properties`, excluye dependencias y generados, e incorpora cobertura JS desde `kinesys/coverage/lcov.info`.
