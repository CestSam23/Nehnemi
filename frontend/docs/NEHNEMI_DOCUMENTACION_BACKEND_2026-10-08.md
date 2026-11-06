# NEHNEMI — Documentación del backend implementado

**Fecha de auditoría:** 2026-10-08  
**Repositorio:** https://github.com/CestSam23/nehnemi_backend  
**Rama:** `main`  
**Alcance:** lectura del código Python, modelos, esquemas, servicios, `database.sql` y `migraciones/001_contrato_final.sql`. Sin cambios al repositorio.

## 1. Criterio de evidencia

- **C (código):** comportamiento y respuesta determinables inspeccionando código y esquemas actuales. No equivale a prueba HTTP ejecutada hoy.
- **O (observado):** datos vistos en ejecuciones previas de API contra PostgreSQL. Pueden cambiar si la base cambió.
- **P (pendiente):** comportamiento no implementado o no comprobado.
- Los UUID y tokens usados en ejemplos ilustrativos son **marcadores**, no identificadores extraídos de la base.

## 2. Arquitectura, ejecución y convenciones

`FastAPI → routers (app/routes) → servicios (app/services) / modelos SQLAlchemy (app/models) → PostgreSQL  + PostGIS`.

- API usual: `http://127.0.0.1:8000/api/v1`; salud de implementación: `GET /health` (fuera de `/api/v1`).
- `app/main.py` registra nueve routers: zonas, estaciones, ciudadanos, solicitudes, interacciones, autenticación, fuentes, contenidos y panorama.
- FastAPI genera documentación interactiva `/docs` y OpenAPI `/openapi.json` si se mantienen los ajustes predeterminados.
- Variables obligatorias para importar módulos: `DATABASE_URL`, `JWT_SECRET` (ciudadano), `JWT_GOBIERNO_SECRET`; `COOKIE_SECURE` opcional (`false` predeterminado, solo razonable en HTTP local).
- Autenticación ciudadana: `Authorization: Bearer <token JWT>`; HS256, `tipo=ciudadano`, expiración 365 días.
- Autenticación gubernamental: cookie HTTP-only `nehneni_sesion`, HS256, `tipo=gobierno`, 30 minutos, `SameSite=Lax`, ruta `/api/v1`; roles `ANALISTA` y `ADMINISTRADOR`.
- Errores HTTP de FastAPI: `{"detail":"mensaje"}`; validaciones automáticas producen `422` con lista en `detail`. No se observó envoltorio universal `{error:{...}}`.
- Los métodos GET consultan tablas y vistas: no recalculan puntuaciones. Las escrituras principales hacen `db.commit()` directamente.

## 3. Índice exhaustivo de rutas montadas (27 operaciones)

| Método | Ruta (prefijo `/api/v1` salvo `/health`) | Autenticación efectiva | Estado |
|---|---|---|---|
| GET | `/health` | No | C |
| GET | `/panorama` | No | C/O |
| GET | `/zonas` | No | C/O |
| GET | `/zonas/mapa` | No | C/O |
| GET | `/zonas/{clave}` | No | C |
| GET | `/zonas/{clave}/indicadores` | No | C/O |
| GET | `/zonas/{clave}/resumen` | No | C |
| GET | `/zonas/{clave}/senales` | No | C |
| GET | `/zonas/{clave}/solicitudes` | No | C |
| GET | `/estaciones-carga` | No | C |
| GET | `/estaciones-carga/{estacion_id}` | No | C |
| POST | `/ciudadanos` | No | C |
| GET | `/ciudadanos/mi-perfil` | Bearer ciudadano | C |
| PATCH | `/ciudadanos/mi-perfil` | Bearer ciudadano | C |
| DELETE | `/ciudadanos/mi-perfil` | Bearer ciudadano | C |
| GET | `/ciudadanos/mis-solicitudes` | Bearer ciudadano | C |
| POST | `/solicitudes-infraestructura` | Bearer ciudadano | C |
| GET | `/solicitudes-infraestructura` | Cookie Gobierno | C |
| GET | `/solicitudes-infraestructura/{solicitud_id}` | Cookie Gobierno | C |
| PATCH | `/solicitudes-infraestructura/{solicitud_id}` | Cookie Gobierno, ADMINISTRADOR | C |
| POST | `/interacciones` | Bearer ciudadano | C |
| POST | `/autenticacion/iniciar-sesion` | No | C |
| GET | `/autenticacion/sesion` | Cookie Gobierno | C |
| POST | `/autenticacion/cerrar-sesion` | No | C |
| GET | `/fuentes-datos` | No | C |
| GET | `/contenidos` | No | C |
| GET | `/contenidos/{slug}` | No | C |

## 4. Endpoints: usos, parámetros, flujo, respuesta y limitaciones

### 4.1 Sistema y panorama

**GET `/health`** — comprueba SQL `SELECT 1` con `engine.connect()`. Sin parámetros ni auth. **200 C:** `{"estado":"ok","base_datos":"conectada"}`. Si la BD no responde, la excepción no tiene manejo específico y puede producir 500. **No existe `GET /api/v1/salud` en el código actual.**

**GET `/api/v1/panorama`** — panorama CDMX, sin parámetros ni auth. Ejecuta conteos SQL sobre `zonas`, `estaciones_carga`, suma `conectores_carga.cantidad`, solicitudes y fuentes; `fecha_actualizacion` es hora de la petición, NO fecha de frescura del dataset.

**Respuesta O parcial**, registrada en prueba anterior:
```json
{
  "cobertura_territorial":{"alcaldias":16,"agebs":2431},
  "infraestructura":{"estaciones_registradas":381,"conectores_registrados":1021,"estado_operativo_verificado":false},
  "participacion":{"solicitudes_registradas":0},
  "fuentes_documentadas":5
}
```
**Otros campos C:** `fecha_actualizacion` (ISO UTC), `dimensiones.ADOPCION={"disponible":false,"motivo":"Sin datos territoriales suficientes"}`, `INFRAESTRUCTURA={"disponible":true}`, `PARTICIPACION={"disponible":false,"motivo":"Sin evaluación territorial consolidada"}`, `ACCESIBILIDAD={"disponible":true}`. **Limitación:** las disponibilidades son constantes, no calculadas a partir de snapshots vigentes. No devuelve distribuciones, ventas ni priorización del contrato previsto.

### 4.2 Zonas y mapa

**GET `/api/v1/zonas`** — catálogo territorial. Query opcional `tipo ∈ {CDMX, ALCALDIA, AGEB}`, `zona_padre` (clave), `buscar` (texto parcial en nombre o clave, case-insensitive). Solo `activa=true`; orden tipo/nombre; sin paginación. **200 C:** array directo de `{clave:string,tipo:string,nombre:string,zona_padre_clave:string|null}`. **O:** `?tipo=ALCALDIA` devolvió las 16 alcaldías. **422:** `tipo` no válido.

**GET `/api/v1/zonas/mapa`** — GeoJSON de polígonos. Query **obligatoria** `tipo=ALCALDIA|AGEB` y `dimension=ADOPCION|INFRAESTRUCTURA|PARTICIPACION|ACCESIBILIDAD`. `LEFT JOIN` de `zonas` y vista `indicadores_actuales`, solo zonas activas con geometría; `ST_AsGeoJSON` + `json.loads`. **200 C:**
```json
{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[]},"properties":{"clave":"CLAVE","tipo":"AGEB","nombre":"NOMBRE","dimension":"INFRAESTRUCTURA","disponible":true,"puntuacion":94.51,"nivel":"ALTA","confianza":"ALTA"}}]}
```
La geometría vacía y los textos `CLAVE`/`NOMBRE` son solo **estructura ilustrativa**, no feature real. Cuando falta snapshot: `disponible=false`, `puntuacion=null`, `nivel=null`, `confianza=null`. **O:** `?tipo=ALCALDIA&dimension=INFRAESTRUCTURA` devolvió `FeatureCollection` con 16 features. **Limitación:** geometrías completas, sin simplificación/paginación ni gestión de peso de respuesta.

**GET `/api/v1/zonas/{clave}`** — detalle básico por clave geográfica. **200 C:** `{clave,tipo,nombre,zona_padre_clave,activa}`. **404:** `Zona no encontrada`. A diferencia de otros detalles, permite leer zona inactiva si coincide la clave.

**GET `/api/v1/zonas/{clave}/indicadores`** — indicadores ACTUALES. Path `clave` obligatorio, sin query `historico`. Verifica zona activa; consulta vista `indicadores_actuales` y produce exactamente cuatro dimensiones en este orden: ADOPCION, INFRAESTRUCTURA, PARTICIPACION, ACCESIBILIDAD. **200 C:**
```json
{"zona_clave":"0901500010540","indicadores":[
 {"dimension":"ADOPCION","disponible":false,"puntuacion":null,"nivel":null,"confianza":null,"tamano_muestra":null,"componentes":null,"explicacion":null},
 {"dimension":"INFRAESTRUCTURA","disponible":true,"puntuacion":94.51,"nivel":"ALTA","confianza":"ALTA","tamano_muestra":null,"componentes":{"estaciones_en_zona":1,"conectores_en_zona":3,"potencia_total_kw":54.0,"capacidad_score":97.82,"cobertura_score":91.2},"explicacion":null}
]}
```
**Ejemplo mixto:** puntuación y componentes citados fueron observados anteriormente para esa AGEB; `tamano_muestra` y `explicacion` se muestran como `null` solo a modo de ilustración: su valor real no está verificado en esta auditoría. Una respuesta verdadera tendrá **cuatro** elementos, no solo los dos abreviados. **404** si clave inexistente/inactiva. Ausencia de evidencia NO se transforma en cero.

**GET `/api/v1/zonas/{clave}/resumen`** — cabecera territorial + indicadores actuales + infraestructura derivada del JSON `componentes` del indicador INFRAESTRUCTURA. **200 C:** `{clave,tipo,nombre,zona_padre_clave,indicadores:[cuatro indicadores],infraestructura:{estaciones:int,conectores:int,potencia_total_kw:float,distancia_estacion_m:float|null}|null}`. `infraestructura=null` si no hay snapshot disponible; `0` es valor predeterminado al faltar componentes concretos. **404** zona no activa. No incluye señales, diagnóstico, calidad de datos ni recomendación en un solo endpoint.

**GET `/api/v1/zonas/{clave}/senales`** — señales heurísticas sobre los snapshots: `{zona_clave,senales:[{codigo,categoria,valor,unidad,descripcion}]}`. Reglas actuales: `SIN_INFRAESTRUCTURA_LOCAL` si estaciones=0; `SIN_CONECTORES_LOCALES` si conectores=0; `DISTANCIA_CARGA_ELEVADA` si distancia >=2000 m; `INFRAESTRUCTURA_BAJA` si nivel BAJA o MUY_BAJA; `ALTA_TENENCIA_AUTOMOVIL` si tenencia >=0.5; `VIVIENDAS_CON_AUTOMOVIL` si componente disponible; y `SIN_EVIDENCIA_ADOPCION`, `SIN_EVIDENCIA_PARTICIPACION` cuando no existen snapshots. Los campos opcionales de cada señal pueden devolverse `null`. **404** zona ausente/inactiva. **Limitación:** señales descriptivas fijas; no un modelo estadístico o recomendador operativo.

**GET `/api/v1/zonas/{clave}/solicitudes`** — agregación exacta en esa zona (`zona_id`, no descendientes). **200 C:** `{zona_clave,total:int,por_estado:[{valor,cantidad}],por_motivo:[{valor,cantidad}]}`. **404** zona ausente/inactiva. No incluye serie temporal ni `tendencia`.

### 4.3 Estaciones

**GET `/api/v1/estaciones-carga`** — búsqueda pública de puntos. Query opcional: `clave_zona` (filtro por zona asignada exactamente), `buscar` (ILIKE por nombre/dirección), `latitud` entre -90 y 90, `longitud` entre -180 y 180, `radio_km` >0 y <=100. Si hay `radio_km`, ambos valores de coordenadas son obligatorios: **422** `radio_km requiere latitud y longitud`. Zona inexistente: **404**. Filtrado de proximidad con `ST_DWithin` sobre `Geography`, en metros. Sin radio, latitud/longitud solas no filtran. Sin paginación ni orden por proximidad: orden alfabético por estación.

**200 C:** array de objetos:
```json
[{"id":"<uuid>","identificador":"<identificador|null>","nombre":"<nombre>","direccion":"<direccion|null>","ubicacion":{"latitud":19.0,"longitud":-99.0},"estado_demostracion":null,"conectores":[{"cantidad":1,"tipo_conector":"<tipo|null>","potencia_kw":null,"estado_operativo":null}]}]
```
**Importante:** las coordenadas, cantidad y nulos son valores de muestra para mostrar el esquema, no filas recuperadas. No debe interpretarse `estado_operativo` como disponibilidad en vivo.

**GET `/api/v1/estaciones-carga/{estacion_id}`** — UUID obligatorio, 422 si no es UUID, **404** si no existe. Consulta estación, clave de zona por LEFT JOIN, y grupos de conectores por `numero_grupo`. **200 C:** `{id,nombre,direccion,latitud,longitud,zona_clave,conectores:[{tipo_conector,cantidad,potencia_kw,estado_operativo}]}`. Nota: el detalle devuelve coordenadas planas y no el objeto `ubicacion` del listado.

### 4.4 Perfil ciudadano

**POST `/api/v1/ciudadanos`** — onboarding sin cuenta/correo. Body requerido: `tiene_automovil:boolean`, `propulsion`, `consideraria_ev`, `barrera_principal`, `consentimiento_agregado:boolean`; opcionales `ubicacion:{latitud,longitud}` o `clave_zona:string`. Si ambos llegan, se prioriza `clave_zona`. Valida que la zona exista/esté activa; para coordenadas utiliza `ST_Covers` sobre AGEB activas. Si ninguno viene, crea perfil sin zona. **201 C:** `{id:"<uuid>",token:"<JWT>",zona_clave:"<clave|null>"}`. **422** zona inválida/no cubierta o enum inválido. No exige que `consentimiento_agregado` sea `true`: solo obliga a que se envíe un booleano.

Enums: `propulsion=ELECTRICO|HIBRIDO_ENCHUFABLE|HIBRIDO|COMBUSTION|OTRO|SIN_AUTOMOVIL`; `consideraria_ev=SI|NO|NO_SE`; `barrera_principal=PRECIO|CARGA|AUTONOMIA|INFORMACION_DUDAS|CARACTERISTICAS_VEHICULO|NO_INTERESA|OTRA|NINGUNA`.

**GET `/api/v1/ciudadanos/mi-perfil`** — token Bearer ciudadano. **200 C:** `{id,zona_clave,tiene_automovil,propulsion,consideraria_ev,barrera_principal,consentimiento_agregado}`. **401** si token ausente, inválido o perfil eliminado.

**PATCH `/api/v1/ciudadanos/mi-perfil`** — mismo token. Body parcial de campos de creación y/o `ubicacion` / `clave_zona`; requiere al menos un campo, prohíbe asignar null a los enviados, resuelve zona según prioridades mencionadas. **200 C:** mismo objeto que GET. **422** body vacío/null o zona inválida. **401** token/perfil no válido. No hay comprobación de consistencia entre `tiene_automovil` y `propulsion`.

**DELETE `/api/v1/ciudadanos/mi-perfil`** — mismo token. En una transacción elimina interacciones, solicitudes y perfil. **204 C:** respuesta sin body. **401** token/perfil inválido. Consecuencia importante: se pierde también la evidencia aportada por ese perfil, y el JWT no se revoca en lista negra; deja de funcionar al desaparecer el perfil.

**GET `/api/v1/ciudadanos/mis-solicitudes`** — Bearer ciudadano. **200 C:** array `{id,zona_clave,motivo,comentario,estado,creado_en,ubicacion:{latitud,longitud}}`, ordenado por `creado_en DESC`. Puede ser `[]`. **401** token/perfil inválido. Sin paginación.

### 4.5 Solicitudes

**POST `/api/v1/solicitudes-infraestructura`** — Bearer ciudadano. Body `{ubicacion:{latitud:number,longitud:number},motivo:enum,comentario?:string|null}`; comentario máximo 500 caracteres. Enum `motivo=VIVO_CERCA|TRABAJO_CERCA|TRANSITO_FRECUENTE|TENGO_EV|CONSIDERARIA_EV_CON_CARGA|OTRO`. Resuelve AGEB por `ST_Covers`, crea punto EPSG:4326 y solicitud con `estado=REGISTRADA`. **201 C:** `{id:"<uuid>",zona_clave:"<clave>",motivo:"VIVO_CERCA",estado:"REGISTRADA"}`. Los marcadores y la elección del motivo son ilustrativos. **401** sin perfil; **422** ubicación fuera de AGEB disponible / validación. No ordena construcción automática.

**GET `/api/v1/solicitudes-infraestructura`** — cookie de Gobierno válida (ANALISTA o ADMINISTRADOR). Query: `pagina:int` default 1 (>=1), `limite:int` default 20 (1..100), `estado` opcional enum y `clave_zona` opcional. **200 C:** `{total:int,pagina:int,limite:int,solicitudes:[{id,zona_clave,motivo,comentario,estado,creado_en}]}`. **401** sin sesión; **422** estado o paginación inválida. Los datos están anonimizados en la salida. La consulta solo filtra `Zona.clave` exacta y no agrega jerarquía.

**GET `/api/v1/solicitudes-infraestructura/{solicitud_id}`** — cookie Gobierno; UUID. **200 C:** objeto `{id,zona_clave,motivo,comentario,estado,creado_en}`. **401** sesión; **404** no existe; **422** UUID inválido. **La ciudadanía no puede usar este endpoint** pese a que el contrato aspiracional mencionaba propietario/gobierno; tiene su propio listado `mis-solicitudes`.

**PATCH `/api/v1/solicitudes-infraestructura/{solicitud_id}`** — cookie Gobierno de rol `ADMINISTRADOR` (403 para ANALISTA). Body requerido `{estado:"REGISTRADA"|"EN_REVISION"|"ATENDIDA"|"DESCARTADA"}`. **200 C:** mismo objeto administrativo actualizado. **404** no existe; **422** enum inválido. No hay comprobación de transiciones de estado ni bitácora de quién lo cambió.

**GET `/api/v1/zonas/{clave}/solicitudes`** documentado arriba: conteos, sin auth.

### 4.6 Interacciones y contenidos

**POST `/api/v1/interacciones`** — Bearer ciudadano. Body `{tipo:string (1..80 caracteres),metadatos?:objeto JSON (default {})}`. Verifica perfil, registra interaccion con `perfil_ciudadano_id` y zona tomada de su perfil actual. **201 C:** `{id:int,tipo:string}`. No valida un enum cerrado de tipo; tampoco calcula automáticamente la dimensión PARTICIPACION. **401** sin token/perfil, **422** body inválido.

**GET `/api/v1/contenidos`** — contenidos públicos de Lititio. Sin parámetros efectivos; SQL `WHERE publicado = TRUE ORDER BY orden,titulo`. **200 C:** array `{id,slug,titulo,resumen,categoria,orden}`; `[]` si no hay contenido publicado. **El filtro `?categoria=` del contrato no está implementado en el router**, por tanto no filtra.

**GET `/api/v1/contenidos/{slug}`** — contenido publicado por slug exacto. **200 C:** `{id,slug,titulo,resumen,categoria,orden,contenido,creado_en}`. **404** si no existe o no está publicado. La API no edita/publica contenidos.

**GET `/api/v1/fuentes-datos`** — lista pública desde tabla `fuentes_datos`, ordenada por nombre. **200 C:** array `{id,clave,nombre,tipo_procedencia,referencia,fecha_referencia,fecha_descarga,notas}`. Las fechas ISO pueden ser `null`. No permite subir nuevas fuentes por API.

### 4.7 Gobierno: autenticación

**POST `/api/v1/autenticacion/iniciar-sesion`** — body `{correo:string,contrasena:string}`. Busca usuario activo por email normalizado (`strip().lower()`), compara hash de contraseña, crea JWT HS256 a 30 minutos en cookie HTTP-only `nehneni_sesion`. **200 C:** `{id,nombre,correo,rol}` y encabezado `Set-Cookie`. No devuelve token en JSON. **401** `Credenciales incorrectas`.

**GET `/api/v1/autenticacion/sesion`** — requiere cookie. **200 C:** `{id,nombre,correo,rol}`. **401** sesión ausente/inválida, usuario desactivado o inexistente.

**POST `/api/v1/autenticacion/cerrar-sesion`** — **no requiere cookie**; emite encabezado para borrar `nehneni_sesion` en ruta `/api/v1`. **204 C:** sin body. No invalida JWT en servidor antes de que expire.

## 5. Flujos completos implementados

### Flujo A: mapa territorial web

1. `GET /zonas?tipo=ALCALDIA` obtiene claves y nombres.
2. `GET /zonas/mapa?tipo=ALCALDIA&dimension=INFRAESTRUCTURA` obtiene GeoJSON y puntuaciones.
3. Selección de clave → `GET /zonas/{clave}/resumen` y `GET /zonas/{clave}/senales`.
4. `GET /zonas/{clave}/solicitudes` devuelve señales de demanda medidas por solicitudes registradas.
5. **Límite:** no existe ruta de recomendación ni acción para recalcular indicadores en `main`.

### Flujo B: mapa de estaciones móvil

1. `GET /estaciones-carga` con zona, texto o proximidad.
2. Mostrar puntos y conectores devueltos por backend.
3. `GET /estaciones-carga/{id}` para detalle de grupos de conectores.
4. **Límite:** `estado_operativo` no certifica estado en vivo; no existen reserva, pago ni navegación propia.

### Flujo C: onboarding y participación

1. `POST /ciudadanos` con respuestas y ubicación opcional → `token`.
2. Almacenar token en dispositivo y mandar `Authorization: Bearer`.
3. `PATCH /ciudadanos/mi-perfil` para actualizar barrera, propulsión o zona.
4. `POST /interacciones` para telemetría declarativa.
5. `POST /solicitudes-infraestructura` con coordenadas → AGEB resuelta en servidor → estado inicial REGISTRADA.
6. `GET /ciudadanos/mis-solicitudes` consulta estado.
7. `DELETE /ciudadanos/mi-perfil` elimina perfil y sus evidencias relacionadas.
8. **Límite:** guardar datos no recalcula ADOPCION/PARTICIPACION automáticamente.

### Flujo D: gestión gubernamental

1. `POST /autenticacion/iniciar-sesion` establece cookie.
2. `GET /autenticacion/sesion` recupera usuario.
3. `GET /solicitudes-infraestructura` lista y filtra.
4. `GET /solicitudes-infraestructura/{id}` abre el detalle.
5. ADMINISTRADOR usa `PATCH /solicitudes-infraestructura/{id}` para actualizar estado.
6. `POST /autenticacion/cerrar-sesion` elimina cookie del navegador.
7. **Límite:** sin auditoría de decisiones, sin workflow de aprobaciones, sin invalidación anticipada del JWT.

## 6. Modelo de datos real (scripts SQL)

`database.sql` crea extensiones `postgis` y `pgcrypto`; la base `nehnemi`, enums, diez tablas base y dos vistas. La migración `001_contrato_final.sql` añade dos enums, dos tablas y endurece columnas de solicitudes.

| Objeto SQL | Función y relaciones clave | Consumido por |
|---|---|---|
| `zonas` | árbol CDMX→alcaldía→AGEB, geometría MultiPolygon EPSG:4326 | zonas, mapa, resolución territorial |
| `fuentes_datos` | procedencia, fechas y trazabilidad | fuentes, ETL, panorama |
| `observaciones` | medidas zonales por fuente y período | ETL; no CRUD público actual |
| `estaciones_carga` | estación puntual y FK de zona/fuente | endpoints estaciones |
| `conectores_carga` | grupos, cantidad, tipo, potencia, estado | endpoints estaciones y panorama |
| `perfiles_ciudadanos` | respuestas del onboarding y zona opcional | ciudadanos, solicitudes, interacciones |
| `solicitudes_infraestructura` | demanda geográfica, motivo, estado, FK ciudadano | solicitudes, agregados |
| `interacciones` | evento ciudadano + JSONB de metadatos | POST interacciones |
| `evaluaciones_indicadores` | puntuaciones históricas por zona y dimensión | vista de indicadores |
| `recomendaciones` | persistencia prevista de diagnósticos/reglas | sin endpoint actual |
| `usuarios_gobierno` | usuarios activos, rol, contraseña hash | autenticación y autorizaciones |
| `contenidos_informativos` | piezas publicadas de Lititio | contenidos |
| `indicadores_actuales` | vista `DISTINCT ON (zona_id,dimension)`, último `calculado_en` | mapa, indicadores, resumen |
| `resumen_infraestructura_ageb` | vista de agregados de estaciones/conectores por AGEB | no se consulta directamente en rutas inspeccionadas |

**Advertencias SQL:** `database.sql` es el esquema base, no un volcado actual de filas. La migración `001` no es idempotente (CREATE TYPE/TABLE sin `IF NOT EXISTS`); debe aplicarse una sola vez en una base compatible. La migración cambia `motivo` a enum, y requiere que los datos existentes sean convertibles. `conectores_registrados` en panorama suma `cantidad`: no equivale a `COUNT(*)` de grupos de conectores. Las geometrías son EPSG:4326; en operaciones de distancia el endpoint convierte a Geography para metros.

## 7. Limitaciones, riesgos y desviaciones del contrato original

### Críticas para integración

1. **Autorización de consultas Gobierno inconsistente:** `/panorama`, `/zonas/mapa`, `/zonas/{clave}/resumen|indicadores|senales|solicitudes` y `/fuentes-datos` no dependen de `obtener_usuario_gobierno`, aunque el OpenAPI contractual los contempla como protegidos.
2. **Inexistencia de rutas del recomendador:** no se montan `GET /zonas/{clave}/recomendaciones` ni `POST /zonas/{clave}/evaluar`.
3. **Inexistencia de tendencias EV:** falta `GET /tendencias/electromovilidad`.
4. **Histórico no expuesto:** GET indicadores no acepta `historico`; lee únicamente vista `indicadores_actuales`.
5. **Onboarding tolera consentimiento `false`:** la aplicación debe manejar consentimiento explícito correctamente; el backend solo exige el booleano, no su veracidad.
6. **No disponibilidad en tiempo real:** estado de conectores solo refleja datos persistidos; panorama explícitamente `estado_operativo_verificado=false`.
7. **Datos de adopción y participación sin cálculo territorial:** perfiles, interacciones y solicitudes se guardan, pero no provocan evaluación de sus indicadores.

### Importantes para web/móvil y calidad

8. **`/health` no coincide con `/api/v1/salud`** contractual; payload actual no tiene `servicio` y `version`.
9. **El endpoint `/zonas/{clave}` existe adicionalmente** al contrato original, y devuelve datos básicos.
10. **Listas sin paginación:** zonas, estaciones, contenidos y `mis-solicitudes` devuelven todos los registros coincidentes.
11. **Paginación administrativa divergente:** la ruta implementa `limite`; el contrato OpenAPI previo usa `tamano`.
12. **Contenido por categoría:** `GET /contenidos` no implementa parámetro `categoria`.
13. **Estación: respuestas diferentes en listado/detalle:** `ubicacion` anidada vs `latitud` y `longitud` al nivel raíz.
14. **Zona padre en solicitudes:** filtros y agregados son por FK exacta, no una suma recursiva de AGEB de alcaldía.
15. **Eliminación destructiva del perfil:** borra interacciones y solicitudes; se pierde evidencia histórica y no es un anonimizado conservando agregados.
16. **Interacciones sin taxonomía cerrada:** `tipo` es texto libre; el contrato enumera tipos predefinidos. No garantiza semántica homogénea.
17. **Sin reglas de transición de solicitudes:** cualquier cambio entre estados admitidos es aceptado a ADMINISTRADOR.
18. **Fecha de panorama es de respuesta, no de dataset:** evitar etiquetarla como fecha de actualización oficial.
19. **Configuración CORS no incluida en `main.py`**: si frontend web y API están en orígenes diferentes, se requerirá configuración compatible o proxy del mismo origen. Las cookies de Gobierno requieren especial atención.
20. **Sin pruebas automáticas visibles en el árbol del repositorio:** no se encontró carpeta de tests ni pipeline que certifique contratos end-to-end.
21. **Archivo `cookies.txt` versionado en repositorio**: revisar de inmediato si contiene cookies/tokens vigentes, y eliminarlos/rotarlos si procede. No se reproducen secretos en esta documentación.
22. **Diferencia modelo/migración:** `usuarios_gobierno.correo` es varchar(200) en SQL y String(255) en ORM (riesgo de error para valores largos). La columna solicitud `perfil_ciudadano_id` es nullable en SQL (`ON DELETE SET NULL`), mientras el modelo ORM la declara no nula. Confirmar semántica deseada.
23. **Sin verificación de despliegue activo en esta auditoría:** accesibilidad del código no implica que la BD local o endpoints HTTP respondan hoy sin errores.

## 8. Casos de datos registrados previamente (no probados hoy)

- 16 alcaldías, 2,431 AGEB, 381 estaciones en panorama; 1,021 conectores calculados como suma de cantidades; 5 fuentes; cero solicitudes al momento de esa consulta.
- AGEB `0901500010540`: INFRAESTRUCTURA 94.51 / ALTA; componentes previamente observados: 1 estación, 3 conectores, potencia 54 kW, cobertura 91.2, capacidad 97.82.
- AGEB `090050001039A`: INFRAESTRUCTURA 10.28 / MUY_BAJA; accesibilidad 91.42 / ALTA, distancia aproximada 2636.27 m según controles de datos previos.
- AGEB `0900700014274`: INFRAESTRUCTURA 1.48 / MUY_BAJA; accesibilidad 2.59 / MUY_BAJA, según controles de datos previos.

Estos valores son **anclas para pruebas de regresión**, no garantías de que la base actual conserve exactamente los mismos snapshots.

## 9. Cómo obtener respuestas HTTP actuales verdaderamente reproducibles

Con FastAPI corriendo en el host de desarrollo, ejecutar (sin pegar tokens/cookies reales en repositorio):

```bash
curl -sS -i http://127.0.0.1:8000/health
curl -sS 'http://127.0.0.1:8000/api/v1/panorama' | python -m json.tool
curl -sS 'http://127.0.0.1:8000/api/v1/zonas?tipo=ALCALDIA' | python -m json.tool
curl -sS 'http://127.0.0.1:8000/api/v1/zonas/0901500010540/indicadores' | python -m json.tool
curl -sS 'http://127.0.0.1:8000/api/v1/zonas/0901500010540/resumen' | python -m json.tool
curl -sS 'http://127.0.0.1:8000/api/v1/zonas/0901500010540/senales' | python -m json.tool
curl -sS 'http://127.0.0.1:8000/api/v1/estaciones-carga?radio_km=2&latitud=19.4&longitud=-99.1' | python -m json.tool
curl -sS http://127.0.0.1:8000/openapi.json > openapi_actual.json
```

No se ejecutaron en esta auditoría; requieren acceso al servidor y su PostgreSQL. Antes de automatizar POST/PATCH/DELETE en pruebas, utilizar base desechable o rollback planificado para evitar modificación de datos reales.

## 10. Recomendaciones por prioridad

**Antes de integración web/móvil:** fijar como contrato **actual** los 27 métodos/rutas descritos, en lugar de asumir que el antiguo YAML representa exactamente el código; decidir explícitamente qué GET debe requerir login; resolver CORS/cookies y la discrepancia `limite`/`tamano`.

**Antes de demostración:** probar HTTP con la BD cargada, documentar respuestas completas capturadas (sin JWT), confirmar las dimensiones realmente disponibles, y evitar presentar potencia o estado de conectores como disponibilidad verificada en tiempo real.

**Después:** implementar rutas de recomendación, histórico, tendencias y evaluación con muestras y confianza; añadir tests de integración y migraciones controladas.

## 11. Fuentes auditadas

Archivos leídos en rama `main`: `app/main.py`, los nueve archivos de `app/routes/`, esquemas `app/schemas/` (ciudadano, estación, indicador, interacción, resumen, señal, solicitud, ubicación y zona), servicios `app/services/` (autenticación ciudadana, diagnóstico, indicadores, solicitudes y zonas), modelos SQLAlchemy relacionados, `app/database.py`, `database.sql`, `migraciones/001_contrato_final.sql`, `requirements.txt`.

**Nota de alcance:** las respuestas estructuradas de esta documentación son el contrato **efectivamente codificado**; los JSON con marcadores son ilustrativos y se identifican como tales. Para certificar respuestas vivas faltan pruebas HTTP sobre el despliegue vigente.
