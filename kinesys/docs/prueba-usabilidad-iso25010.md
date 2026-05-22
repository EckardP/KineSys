# Prueba integral de usabilidad ISO/IEC 25010

## Prueba elegida

**Nombre:** Usabilidad de primer contacto `Home -> Login`  
**Tipo:** Prueba de sistema de usabilidad con automatizacion tecnica y validacion breve con usuarios  
**Herramientas:** Playwright, `@axe-core/playwright` y Storybook para evidencia visual complementaria

Esta prueba usa un solo objetivo real: una persona nueva debe reconocer que KineSys sirve para gestionar una clinica de fisioterapia, encontrar el acceso al inicio de sesion, operar el formulario y recibir proteccion ante entradas incorrectas.

## Cobertura ISO/IEC 25010

| Subcaracteristica | Evidencia en la prueba |
| --- | --- |
| Reconocibilidad de la adecuacion | `Home` muestra el proposito y las funciones principales del sistema. |
| Aprendizabilidad | El acceso al login, etiquetas y llamada a la accion son autoexplicativos en el primer contacto. |
| Operabilidad | El flujo `Home -> Login` se completa por teclado y con controles visibles. |
| Proteccion contra errores | El login no se envia vacio y muestra error cuando las credenciales no son validas. |
| Estetica de interfaz | Se revisa con Storybook y se confirma con valoracion del usuario. |
| Accesibilidad | axe audita `Home` y `Login` con reglas WCAG automatizadas. |

## Ejecucion automatizada

```powershell
cd C:\Users\aleja\Desktop\Kynesys\KineSys\kinesys
npm.cmd run test:usability
```

Playwright levanta Vite en `http://127.0.0.1:4173`, ejecuta el caso unico y genera:

- capturas del punto de entrada y login en los resultados de Playwright;
- adjuntos JSON de violaciones axe para `Home` y `Login`;
- adjunto `metricas-iso25010.md` con formula, valores `A`, `B`, `X` y criterios medidos;
- adjunto `metricas-iso25010.json` para reutilizar los valores calculados;
- reporte HTML en `playwright-report` cuando termina la ejecucion.

En el reporte HTML abre la prueba `ISO 25010 | usabilidad de primer contacto Home -> Login` y revisa la seccion de adjuntos. El resumen de metricas tambien se imprime en la terminal durante la ejecucion.

## Caso de prueba para el informe

| Campo | Contenido |
| --- | --- |
| ID | `USAB-ISO-001` |
| Modulo | Punto de entrada e inicio de sesion |
| Objetivo | Verificar que un usuario nuevo reconoce el proposito del sistema y puede iniciar la interaccion sin bloqueos evidentes. |
| Precondicion | Frontend de KineSys instalable y ejecutable con Vite. |
| Datos | Usuario `usuario_prueba`, clave `clave_incorrecta`; la respuesta de login se simula como no autorizada. |
| Resultado esperado | Home describe el sistema, Login es navegable, no hay violaciones WCAG automatizadas en esas vistas, el envio vacio se bloquea y el error de credenciales se comunica. |

## Medicion

Para la parte automatizada se puede registrar:

- `UAp`: `A/B = 2/2` senales de proposito encontradas en el punto de entrada.
- `UOp`: `A/B = 1/1` flujo de navegacion de primer contacto completado.
- `UEp`: `A/B = 2/2` protecciones verificadas: bloqueo de envio vacio y mensaje ante credenciales incorrectas.
- `UAc`: `A/B = vistas sin violaciones axe / vistas auditadas`.

La ejecucion automatizada reporta `UEp-2-S` por separado. Si la interfaz detecta un error pero no sugiere un valor correcto, su valor `A` queda en `0` porque esa es la definicion de correccion usada en la diapositiva.

## Validacion con usuarios

La estetica y el aprendizaje real no deben declararse aprobados solo con automatizacion. Ejecuta la misma tarea con 3 a 5 usuarios representativos y registra:

1. Mostrar `Home` durante 5 segundos y preguntar: `Que crees que hace este sistema?`
2. Pedir: `Entra al inicio de sesion sin ayuda.`
3. Pedir una calificacion de 1 a 5 para:
   - la interfaz se ve agradable;
   - los colores y textos transmiten orden y confianza;
   - fue claro donde iniciar la tarea;
   - el mensaje de error fue entendible.

Formula sugerida para estetica `UIn-1`:

```text
X = A / B
A = interfaces evaluadas como agradables por usuarios con calificacion >= 4
B = interfaces evaluadas
```

Formula sugerida para la validacion del flujo:

```text
X = A / B
A = usuarios que reconocen el proposito y llegan al login sin ayuda
B = usuarios participantes
```

## Criterio de aceptacion

La prueba queda aprobada cuando:

- el caso Playwright termina en verde;
- axe no reporta violaciones en `Home` y `Login`;
- al menos el 80% de usuarios entiende el proposito y llega al login sin ayuda;
- al menos el 80% de las valoraciones esteticas y de claridad quedan en 4 o 5.
