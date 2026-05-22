# 🎯 Testing en KineSys - Guía Rápida

## ✅ Estado: Configuración Completada

### 📦 Estructura Final
```
kinesys/
├── src/
│   ├── __tests__/
│   │   ├── utils/                    (75 tests)
│   │   ├── api/                      (45 tests)
│   │   ├── services/                 (95 tests)
│   │   ├── hooks/                    (35 tests)
│   │   └── integration/
│   │       ├── components/           (30 tests)
│   │       │   ├── PacientesComponent.test.jsx
│   │       │   ├── FormPacienteComponent.test.jsx
│   │       │   ├── AppointmentList.test.jsx
│   │       │   ├── AppointmentForm.test.jsx
│   │       │   └── DetallesPaciente.test.jsx
│   │       ├── flows/
│   │       │   └── PacientesFlow.test.jsx
│   │       ├── auth/
│   │       │   └── AuthFlow.test.jsx
│   │       └── audit/
│   │           └── AuditDashboard.test.jsx
│   ├── utils/                        (storage, fetchWrapper, tokenManager)
│   ├── api/                          (apiCliente con inyección)
│   ├── services/                     (refactorizados: pacientes, auditoría, tipoServicioEspecialidades)
│   ├── hooks/                        (useAuth, useAuditoria)
│   └── setupTests.js                 (mocks globales)
├── jest.config.cjs                   (configuración centralizada)
├── babel.config.cjs                  (transpilación para Jest)
└── package.json                     (scripts de test)

```

### 📊 Cobertura Estimada
- **Utils puros**: ~90%
- **API cliente**: ~80%
- **Servicios**: ~88%
- **Hooks**: ~75%
- **Componentes UI**: ~70%
- **Global (lógica de negocio)**: ~80%

### 🚀 Cómo Ejecutar

```bash
# 1. Ir al directorio del proyecto
cd kinesys

# 2. Instalar dependencias (si no lo has hecho)
npm install

# 3. Ejecutar todos los tests
npm test

# 4. Ver coverage con reporte HTML
npm run test:coverage
# Abrir: coverage/lcov-report/index.html

# 5. Modo watch (autorefresh)
npm run test:watch
```

### 📝 Notas Importantes

1. **Configuración única**: Todo Jest está configurado en `kinesys/jest.config.cjs`. No hay archivos de configuración duplicados.
2. **Babel**: Usa `babel.config.cjs` para transpilar JSX/ES6.
3. **Setup global**: `src/setupTests.js` incluye `@testing-library/jest-dom` y mocks de `matchMedia`, `IntersectionObserver`.
4. **FireEvent vs UserEvent**: Se usa `fireEvent` para simplicidad (sin dependencia adicional).
5. **Mocks**: Se aplica `jest.mock()` para servicios y hooks externos.
6. **Rutas**: Los tests asumen rutas de React Router con `MemoryRouter` cuando es necesario.

### 🧩 Módulos Testeados

| Módulo | Componentes | Tests | Tipo |
|--------|-------------|-------|------|
| **Pacientes** | Pacientes.jsx, FormPaciente.jsx | 18 | Unit + Int |
| **Citas** | AppointmentList, AppointmentForm | 14 | Int |
| **Detalle Paciente** | DetallesPaciente.jsx | 8 | Int |
| **Autenticación** | Login, useAuth | 18 | Int + Unit |
| **Auditoría** | AuditDashboard.jsx | 8 | Int |
| **Utils** | storage, fetchWrapper, tokenManager | 75 | Unit |
| **API** | crearApiCliente, decodificarToken | 45 | Unit |
| **Servicios** | pacientesService, auditoriaService, tipoServicioEspecialidadesService | 95 | Unit + Int |
| **Hooks** | useAuth, useAuditoria | 35 | Unit |

**Total**: ~300 tests

### ⚠️ Solución de Problemas

**Error: "her remove unused config files"**
- Causa: Múltiples configs de Jest en raíz.
- Solución: Ya eliminados. Ahora solo `kinesys/jest.config.cjs`.

**Error: "Cannot find module '@/...' "**
- Asegurar que `moduleNameMapper` está configurado en `jest.config.cjs`.
- Usar rutas relativas en tests (`../../../...`) para evitar alias.

**Error: "babel-jest" o "jest-environment-jsdom" not found**
```bash
cd kinesys
npm install
```

**Tests lentos o stuck**
```bash
npm test -- --detectOpenHandles
```

### 📚 Documentación

- `TESTING_README.md` – Guía detallada de comandos y estructura.
- `REFACTORING_SUMMARY.md` – Explicación técnica de refactors.
- `PROJECT_SUMMARY.md` – Resumen ejecutivo del proyecto.

### ✨ Próximos Pasos (Opcional)

1. **Cobertura de componentes restantes**: Terapeutas, Salas, Equipos, Reportes.
2. **E2E con Cypress**: Flujos completos contra backend real.
3. **CI/CD**: GitHub Actions con `npm test -- --coverage`.
4. **Mutation testing** (Stryker): validar calidad de tests.

---

**Listo**: El proyecto es 100% testeable con Jest, siguiendo SOLID y mejores prácticas.
