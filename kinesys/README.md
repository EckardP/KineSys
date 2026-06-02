# KineSys

Frontend React/Vite del sistema de gestion para una clinica de fisioterapia. Esta carpeta contiene la aplicacion web, servicios de consumo del API, rutas por rol, pruebas automatizadas y build de produccion.

## Requisitos

- Node.js 24.x o compatible con Vite 7.
- npm 11.x.
- API .NET disponible en la URL configurada por `src/config/apiConfig.js` o variables de entorno.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
npm run test:coverage
npm run test:jest
```

## Modulos principales

- Autenticacion con JWT y roles: administrador, terapeuta y paciente.
- Gestion de pacientes, fichas, historial y contactos/documentos asociados.
- Gestion de terapeutas, especialidades y disponibilidad.
- Tratamientos, protocolos, servicios, salas y equipos.
- Agenda, citas, asistencia y control de sesiones.
- Reportes operativos con graficos y exportacion CSV.
- Auditoria y soporte de notificaciones en tiempo real con SignalR.

## Evidencia de calidad

La ultima verificacion local dejo estos resultados:

- `npm run lint`: sin errores.
- `npm test`: 10 archivos y 107 pruebas aprobadas.
- `npm run test:coverage`: 71.83% de sentencias y 71.75% de lineas.
- `npm run build`: build productivo generado en `dist/`.

## Documentacion de la entrega final

Desde la raiz del repositorio se puede regenerar la tercera y cuarta parte:

```bash
node scripts/docs/build-ultima-parte-document.js
```

El comando genera:

- `artifacts/documentos/ultima-parte/medicion-estimacion-kinesys.md`
- `artifacts/documentos/ultima-parte/medicion-estimacion-kinesys.html`
- `artifacts/documentos/ultima-parte/metricas-kinesys.json`

La configuracion de SonarQube esta en `../sonar-project.properties`.
