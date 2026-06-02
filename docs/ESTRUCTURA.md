# Estructura del proyecto

Este repositorio queda organizado por responsabilidades para que sea mas facil ubicar codigo, documentos y evidencias.

```text
KineSys/
|-- api/                         API ASP.NET Core y pruebas xUnit
|   |-- ApiPrueba/
|   `-- ApiPrueba.Tests/
|-- kinesys/                     Frontend React/Vite
|   |-- public/
|   |-- scripts/
|   `-- src/
|       |-- features/
|       |   |-- admin/
|       |   |-- auth/
|       |   |-- patient/
|       |   |-- public/
|       |   `-- therapist/
|       |-- services/
|       |-- api/
|       |-- components/
|       `-- router/
|-- scripts/
|   `-- docs/                     Generadores de documentos academicos
|-- artifacts/
|   |-- documentos/
|   |   |-- plantillas/
|   |   |-- primera-entrega/
|   |   |-- seguridad-iso25010/
|   |   `-- ultima-parte/
|   |-- pruebas/
|   `-- screenshots/
|-- docs/                        Guias internas del repositorio
|-- docker-compose.yml
|-- sonar-project.properties
`-- README.md
```

## Convenciones

- El codigo fuente permanece en `api/` y `kinesys/`.
- Las pantallas del frontend se agrupan por dominio en `kinesys/src/features/`.
- Los scripts repetibles del proyecto viven en `scripts/`.
- Los entregables generados, PDFs, HTMLs y evidencias viven en `artifacts/`.
- Las guias escritas a mano viven en `docs/`.
- Los comandos principales se ejecutan desde la raiz con `npm run ...`.

## Comandos recomendados

```bash
npm run lint
npm run test
npm run build
npm run docs:ultima
npm run docs:ultima:pdf
```
