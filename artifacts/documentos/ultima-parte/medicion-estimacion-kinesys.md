# KineSys - Tercera y cuarta parte

Fecha de medicion: 29 de mayo de 2026

## Cumplimiento del producto

| Modulo | Estado | Evidencia |
| --- | --- | --- |
| Gestion de pacientes | Cumple | CRUD, dashboard, ficha, historial, contactos/documentos desde API |
| Gestion de terapeutas | Cumple | Registro, especialidades, disponibilidad y gestion administrativa |
| Gestion de terapias y tratamientos | Cumple | Tratamientos, protocolos, tipos de servicio y equipos requeridos |
| Agenda y control de sesiones | Cumple | Citas, disponibilidad, calendario, asistencia y dialogos de atencion |
| Reportes y estadisticas | Cumple | Graficos operativos, exportacion CSV y resumen de pacientes/citas/terapeutas |
| Seguridad y roles | Cumple | JWT, rutas por rol, fallback policy autenticada y pruebas de token |
| Auditoria | Cumple parcial | Componentes y controladores de auditoria disponibles; falta mayor evidencia E2E |
| Exportacion PDF clinica | Cumple parcial | Existe soporte documental y exportacion CSV; PDF clinico puede ampliarse |

## Medicion del software

### Objetivos

Evaluar el tamano, calidad interna, calidad externa y capacidad de mantenimiento del sistema KineSys para sustentar decisiones de mejora antes de la entrega final.

### Alcance

Se midieron el frontend React/Vite y la API ASP.NET Core del producto. Se excluyeron dependencias, compilados, cobertura, migraciones generadas, archivos Designer, snapshots de Entity Framework y pruebas automatizadas.

### Tamano del codigo fuente

| Modelo de medicion | Resultado | Analisis |
| --- | --- | --- |
| LOC - lenguaje de programacion | 31062 | Lineas fisicas no vacias en JS/JSX/CSS/C# del producto |
| LOC - SonarQube | 27622 | NLOC no comentadas aplicando sonar-project.properties |
| LOC - otra herramienta local | 27622 | Conteo cloc-like del generador scripts/docs/build-ultima-parte-document.js |

| Extension | Archivos | LOC fisicas | NLOC |
| --- | --- | --- | --- |
| .cs | 87 | 6599 | 5178 |
| .css | 11 | 2109 | 1714 |
| .js | 62 | 3171 | 2525 |
| .jsx | 112 | 19183 | 18205 |

### Tamano orientado a clases

Totales: 114 clases, 297 metodos, WMC promedio 5.06, DIT maximo 1, CBO promedio 2.62.

| Clase | Metodos | WMC | DIT | CBO | Cohesion |
| --- | --- | --- | --- | --- | --- |
| PersonasController | 12 | 50 | 1 | 14 | Baja |
| TratamientoesController | 9 | 26 | 1 | 7 | Baja |
| FacturasController | 15 | 24 | 1 | 9 | Baja |
| FacturaService | 10 | 16 | 0 | 7 | Media |
| HistorialClinicoService | 5 | 16 | 1 | 21 | Baja |
| TerapeutaEspecialidadsController | 9 | 15 | 1 | 3 | Media |
| AuthorizationService | 3 | 15 | 1 | 4 | Media |
| DisponibilidadTerapeutasController | 8 | 14 | 1 | 2 | Alta |
| PacientesController | 7 | 14 | 1 | 4 | Alta |
| TerapeutasController | 7 | 14 | 1 | 3 | Alta |
| DocumentoService | 5 | 14 | 1 | 5 | Media |
| AlertaAgendasController | 7 | 12 | 1 | 2 | Alta |

### Calidad del software - ISO/IEC 25010

| Caracteristica | Metrica/formula | Resultado | Analisis |
| --- | --- | --- | --- |
| Usabilidad | Rutas principales implementadas / rutas requeridas | 8 / 8 = 100% | Paneles por rol y navegacion por modulos; faltan pruebas con usuarios reales. |
| Seguridad | Controles activos / controles esperados | 5 / 5 = 100% | JWT, CORS restringido, fallback policy, manejo 401 y pruebas de token. |
| Portabilidad | Entornos verificados / entornos objetivo | 2 / 3 = 66.7% | Frontend y backend verificados en Windows; Docker/produccion queda pendiente. |
| Mantenibilidad | Cobertura + complejidad media | Cobertura 71.83%, WMC promedio 5.06 | Separacion por capas adecuada; PersonasController concentra mayor complejidad. |
| Rendimiento | Build productivo + tamano de assets | Build exitoso, asset mayor bajo 746 KB | La app compila; conviene seguir dividiendo chunks si crece. |
| Fiabilidad | Pruebas aprobadas / pruebas ejecutadas | 146 / 146 = 100% | 107 pruebas frontend y 39 pruebas backend superadas. |
| Compatibilidad | Navegadores modernos soportados / objetivo | 3 / 3 planeados | React/Vite compatible con Chromium, Firefox y WebKit; requiere validacion visual final. |
| Adecuacion funcional | Modulos documentados implementados / modulos requeridos | 8 / 8 = 100% | El alcance principal del documento esta cubierto o parcialmente cubierto con evidencia. |

## Estimacion del software

Supuesto de costo: $ 4.200.000 COP por persona-mes.

| Modelo | Tamano | Esfuerzo (pm) | Tiempo (meses) | Personas | Costo |
| --- | --- | --- | --- | --- | --- |
| Puntos de funcion | 506.5 PF | 50.7 | 11.1 | 5 | $ 212.738.400 COP |
| Puntos de caso de uso | 152.7 PCU | 23.9 | 8.3 | 3 | $ 100.198.875 COP |
| Puntos de objeto | 212.1 PO | 16.3 | 7.2 | 3 | $ 68.524.615 COP |
| Puntos de historia | 199 PH | 18.1 | 4.5 | 4 | $ 75.981.818 COP |
| Herramienta COCOMO/LOC | 27.6 KLOC | 78.3 | 13.1 | 6 | $ 328.683.883 COP |

## Analisis comparativo

El modelo mas viable para planear la continuacion del proyecto es puntos de caso de uso complementado con puntos de historia, porque ambos reflejan mejor el alcance funcional documentado y la forma incremental en que el equipo ha construido KineSys. COCOMO basado en LOC ofrece una cota superior util para produccion, ya que incorpora costo de estabilizacion, integracion y deuda tecnica.

## Conclusiones generales

1. El producto cubre el alcance principal definido en la documentacion: pacientes, terapeutas, tratamientos, agenda, reportes, seguridad y auditoria.
2. La base tecnica es mantenible: la complejidad media por clase es baja y las pruebas automatizadas pasan.
3. La entrega final necesita anexar capturas de SonarQube si el docente exige evidencia visual; este repo ya incluye `sonar-project.properties` para ejecutarlo.
4. La prioridad tecnica recomendada es reducir la complejidad de `PersonasController`, ampliar pruebas E2E y mejorar la exportacion PDF clinica.
