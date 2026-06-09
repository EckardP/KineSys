# Estructura de `src`

La aplicacion queda separada entre capas compartidas y modulos funcionales.

```text
src/
|-- api/          Adaptadores HTTP por entidad
|-- assets/       Imagenes y recursos estaticos usados por React
|-- components/   Componentes compartidos y UI base
|-- config/       Configuracion de cliente/API
|-- context/      Contextos globales, como autenticacion
|-- features/     Pantallas y componentes por dominio de negocio
|   |-- admin/
|   |-- auth/
|   |-- patient/
|   |-- public/
|   `-- therapist/
|-- hooks/        Hooks reutilizables
|-- lib/          Utilidades de libreria
|-- router/       Definicion de rutas publicas de la app
|-- services/     Casos de uso y fachada hacia api/
|-- styles/       Estilos globales
|-- test/         Setup y utilidades de pruebas
|-- utils/        Utilidades puras y constantes
|-- App.jsx
`-- main.jsx
```

## Regla practica

- Si una pieza pertenece a un flujo de negocio visible, va en `features/<dominio>`.
- Si se reutiliza en varios dominios, va en una capa compartida (`components`, `services`, `api`, `hooks`, `utils`, etc.).
- Las rutas importan pantallas desde `features`; los modulos importan capas compartidas con alias `@/...`.
