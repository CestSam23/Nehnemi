
## Contrato funcional y técnico final

**Web Gobierno + App Ciudadano + Datos + Base de datos + API v1**

Versión 1.0 | 6 de octubre de 2026

Documento de trabajo para el equipo Nehnemi

**Estatus contractual:** Este documento sustituye los contratos preliminares de interfaz y API. Dentro del alcance v1 aquí definido, las pantallas, campos, tablas, enums y rutas `/api/v1` se consideran congelados. Un cambio incompatible deberá tratarse como una versión posterior, no como una modificación silenciosa de v1.

---

## 1. Propósito y alcance del contrato

Este documento define qué construirá cada frente del proyecto Nehmeni y cómo se conectan entre sí. Su objetivo es permitir que web, móvil, backend y datos avancen en paralelo sin interpretar de manera distinta el producto.

- **Web Gobierno:** centro de control territorial para observar, diagnosticar y priorizar intervenciones.
    
- **App Ciudadano:** herramienta simple para encontrar carga, aportar señales y consultar información de electromovilidad.
    
- **Backend/API:** única fuente de reglas, agregaciones, resolución territorial, permisos y contratos de datos.
    
- **PostgreSQL/PostGIS:** fuente de verdad persistente para territorio, datos oficiales, participación, evaluaciones y recomendaciones.
    
- **ETL:** responsable de importar y transformar las fuentes públicas; los clientes nunca calculan indicadores.
    

**Límite de v1:** La v1 no incluye pagos, reservas de cargadores, navegación GPS propia, disponibilidad en tiempo real no respaldada por fuente, chat con IA, red social, gamificación ni instalación automática de infraestructura.

---

## 2. Definición del producto y usuarios

Nehmeni es un programa de la Ciudad de México que coordina la transición hacia la electromovilidad mediante datos, participación ciudadana, planeación de infraestructura e información pública. El software demuestra cómo el programa observa una zona, identifica un cuello de botella, recomienda la siguiente intervención y vuelve a medir.

|Actor|Canal|Necesidad principal|Qué hace|
|---|---|---|---|
|Gobierno CDMX|Web|Entender dónde y por qué intervenir|Explora territorio, compara indicadores, revisa señales, solicitudes y recomendaciones.|
|Ciudadanía con EV|Móvil|Saber dónde cargar y reportar necesidad|Consulta estaciones, solicita infraestructura y aporta señales.|
|Ciudadanía que considera EV|Móvil|Resolver dudas y expresar barreras|Consulta contenido Lititio y declara intención/barrera durante onboarding.|
|Equipo técnico Nehmeni|ETL/API|Mantener datos y reglas coherentes|Carga fuentes, recalcula indicadores y expone contratos estables.|

---

## 3. Arquitectura y responsabilidades

text

WEB GOBIERNO                    APP CIUDADANO
     |                               |
     | HTTPS / JSON                  | HTTPS / JSON
     +---------------+---------------+
                     |
              FASTAPI / API v1
                     |
            PostgreSQL + PostGIS
                     |
     +---------------+---------------+
     |                               |
datos oficiales                 datos Nehnemi
(ETL reproducible)        (perfiles, solicitudes, señales)

|Capa|Sí hace|No hace|
|---|---|---|
|Web|Representación, filtros, navegación, formularios de gestión.|No calcula percentiles, confianza, diagnósticos o recomendaciones.|
|Móvil|Mapa, formularios ciudadanos, contenidos y estado de solicitudes.|No decide AGEB, no agrega estadísticas, no simula disponibilidad real.|
|API|Valida, autoriza, resuelve AGEB, agrega, aplica reglas y serializa respuestas.|No duplica lógica visual del frontend.|
|ETL|Importa, limpia, cruza espacialmente y genera métricas oficiales/derivadas.|No procesa interacciones de pantalla en tiempo real.|
|BD|Persistencia y relaciones geoespaciales.|No contiene lógica de presentación.|

---

## 4. Semántica congelada de datos e indicadores

Las cuatro barras son dimensiones comparativas independientes. No existe un "score total de electrificación" en v1.

|Dimensión|Etiqueta visible|Qué representa|Fuente v1|
|---|---|---|---|
|ADOPCION|Adopción|Presencia observada de EV entre participantes Nehneni con automóvil.|NEHNEMI; aún sin dato territorial real.|
|INFRAESTRUCTURA|Infraestructura|Cobertura geográfica y capacidad pública de carga relativas.|CFE + Censo + DERIVADO.|
|PARTICIPACION|Participación|Qué tan representada y conectada está la ciudadanía de la zona con Nehneni.|NEHNEMI; aún sin dato territorial real.|
|ACCESIBILIDAD|Condiciones de acceso|Condiciones territoriales comparativas que pueden facilitar/dificultar acceso económico a EV.|EVALÚA IDS + Censo + DERIVADO.|

|Puntuación|Nivel visible|
|---|---|
|0-24|MUY_BAJA|
|25-49|BAJA|
|50-74|MEDIA|
|75-100|ALTA|

**Normalización v1:** percentil estricto. Para una métrica donde valores mayores son mejores: `100 x (# zonas válidas con valor estrictamente menor que x) / (# zonas válidas)`. Para distancia a carga se invierte el percentil.

text

infraestructura_score = 0.50 * cobertura_score + 0.50 * capacidad_score
cobertura_score = 100 - percentil_estricto(distancia_estacion_m)
capacidad_score = percentil_estricto(conectores_por_1000_viviendas_con_automovil)
accesibilidad_score = 0.50 * ids_score + 0.50 * tenencia_score
participacion_score = 0.50 * cobertura_nehneni_score + 0.50 * actividad_score
adopcion_score = percentil_estricto(participantes_con_ev / participantes_con_automovil)

|Confianza ciudadana|Regla v1|
|---|---|

---

## 5. Flujo general entre Web y Móvil

1. El ciudadano abre Nehnemi, crea un perfil seudónimo y, si lo acepta, permite asociar sus respuestas a una zona.
    
2. La app le permite consultar estaciones, leer contenido y registrar una solicitud de infraestructura.
    
3. La API resuelve la AGEB a partir de coordenadas y guarda únicamente las señales necesarias para el análisis.
    
4. Las señales se agregan por zona; las solicitudes son evidencia de demanda, no órdenes automáticas de construcción.
    
5. Web Gobierno muestra estado territorial, señales y nivel de confianza.
    
6. El recomendador combina dimensiones y evidencia; si la muestra es insuficiente, prioriza recopilar datos antes de recomendar infraestructura física.
    
7. El gobierno revisa la recomendación y la evidencia. La decisión final permanece humana.
    

text

CIUDADANO -> PERFIL / CONSULTA / SOLICITUD -> API -> AGEB
DATOS OFICIALES -> ETL -> POSTGIS -> INDICADORES + SEÑALES
DIAGNÓSTICO / RECOMENDACIÓN
V
WEB GOBIERNO

---

## 6. Contrato de experiencia: Web Gobierno

La web es el producto principal del hackathon. Su narrativa siempre debe avanzar de panorama a territorio, de territorio a evidencia y de evidencia a recomendación.

### 6.1 Inicio de sesión

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Autenticar a personal gubernamental.|Correo institucional, contraseña; mensajes de credenciales inválidas y sesión expirada.|`POST /autenticacion/iniciar-sesion`; `GET /autenticacion/sesion`.|

### 6.2 Panorama CDMX

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Dar contexto inmediato antes de entrar al mapa.|Total de AGEB, estaciones y conectores; distribución de niveles; último dato de ventas EV; solicitudes/participantes cuando existan; zonas prioritarias.|`GET /panorama`; `GET /tendencias/electromovilidad`.|

### 6.3 Mapa territorial

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Comparar espacialmente una dimensión.|Selector de dimensión, selector AGEB/alcaldía, leyenda, estaciones opcionales, hover/click de zona, estado `SIN_DATOS`.|`GET /zonas/mapa`; `GET /zonas`; `GET /estaciones-carga`.|

### 6.4 Detalle de zona

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Explicar por qué la zona se ve como se ve.|Cuatro dimensiones; datos crudos; componentes; fuentes; señales; confianza; recomendación; ausencia explícita de evidencia.|`GET /zonas/(clave)/resumen`; `/indicadores`; `/senales`; `/recomendaciones`.|

### 6.5 Solicitudes

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Revisar demanda ciudadana sin convertirla en ticketing personal.|Mapa/concentración, filtros, estados, motivos, lista anonimizada; detalle; cambio de REGISTRADA a EN_REVISION/ATENDIDA/DESCARTADA.|`GET /solicitudes-infraestructura`; `GET/PATCH /solicitudes-infraestructura/(id)`; `GET /zonas/(clave)/solicitudes`.|

### 6.6 Datos y metodología

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Hacer transparente de dónde salen los números.|Fuentes, fechas de referencia, procedencia OFICIAL/NEHNEMI/SIMULADO/DERIVADO, fórmulas y aclaraciones.|`GET /fuentes-datos`; `GET /tendencias/electromovilidad`.|

### 6.7 Estados y casos que la Web debe contemplar

- Indicador disponible: score, nivel, explicación, componentes, fuente y fecha.
    
- Indicador no disponible: mostrar "Sin evidencia suficiente"; no dibujar una barra en cero.
    
- Zona sin solicitudes: mostrar cero solicitudes, no error.
    
- Zona con baja confianza ciudadana: destacar que la recomendación depende de recopilar más datos.
    
- Fuente oficial desactualizada: mostrar fecha de referencia; no ocultarla.
    
- Error de red/API: conservar filtros actuales y permitir reintentar.
    
- Sesión expirada: enviar a login sin borrar el estado de navegación local.
    
- Mapa sin dato para una dimensión: usar categoría visual `SIN_DATOS`, distinta de `MUY_BAJA`.
    

---

## 7. Contrato de experiencia: App Ciudadano

La app no es una versión reducida del dashboard. Su función es resolver tres tareas: encontrar carga, participar y aprender.

### 7.1 Primer inicio y consentimiento

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Explicar qué datos se usan y crear identidad seudónima.|Continuar; aceptar uso agregado; permitir ubicación o elegir zona manualmente.|`POST /ciudadanos`.|

### 7.2 Onboarding ciudadano

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Recolectar señales mínimas para Adopción y barreras.|Tiene automóvil; propulsión; consideraría EV; barrera principal; ubicación aproximada o zona seleccionada.|`POST /ciudadanos`; `PATCH /ciudadanos/mi-perfil`.|

### 7.3 Inicio / mapa de carga

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Ayudar a localizar infraestructura existente.|Mapa, búsqueda, ubicación propia si hay permiso, estaciones cercanas, filtro básico.|`GET /estaciones-carga`.|

### 7.4 Detalle de estación

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Mostrar lo que realmente sabemos de una estación.|Nombre, dirección, distancia calculada, grupos de conectores y potencia. Mostrar explícitamente que no hay estado en tiempo real si la fuente no lo provee.|`GET /estaciones-carga/(id)`; `POST /interacciones`.|

### 7.5 Solicitar infraestructura

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Convertir una necesidad ciudadana en señal territorial.|Elegir punto en mapa; motivo principal; comentario opcional de hasta 500 caracteres; confirmación antes de enviar.|`POST /solicitudes-infraestructura`.|

### 7.6 Mis solicitudes

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Dar trazabilidad básica.|Listado propio, fecha, zona, motivo y estado; detalle de una solicitud.|`GET /ciudadanos/mis-solicitudes`; `GET /solicitudes-infraestructura/(id)`.|

### 7.7 Conoce la electromovilidad con Lititio

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Reducir barreras informativas sin prometer un chatbot.|Tarjetas por categoría, listado y detalle; lectura cuenta como interacción útil.|`GET /contenidos`; `GET /contenidos/(slug)`; `POST /interacciones`.|

### 7.8 Mi perfil y privacidad

|Objetivo|Debe mostrar / permitir|Endpoints|
|---|---|---|
|Permitir corregir respuestas y eliminar el perfil.|Editar señales del onboarding; ver zona asociada; eliminar perfil/token.|`GET/PATCH/DELETE /ciudadanos/mi-perfil`.|

### 7.9 Casos móviles obligatorios

- Ubicación concedida: centrar mapa y permitir búsqueda cercana.
    
- Ubicación denegada: la app sigue funcionando; el usuario puede buscar/panear y seleccionar zona manualmente.
    
- Sin estaciones cercanas: ofrecer de forma contextual "Solicitar infraestructura".
    
- Fuente sin disponibilidad en vivo: nunca mostrar "libre/ocupado" como dato real.
    
- Usuario sin automóvil: `propulsion=SIN_AUTOMOVIL`; puede declarar si consideraría EV y su barrera.
    
- Solicitud fuera de CDMX: rechazar con mensaje claro y no crear zona artificial.
    
- Solicitud duplicada cercana: se permite registrar como señal independiente de demanda; el backend puede advertir, pero no fusiona ciudadanos.
    
- Perfil eliminado: invalidar token ciudadano y desvincular solicitudes mediante las reglas de privacidad definidas por backend.
    

---

## 8. Contrato de formularios y validaciones

|Formulario|Campo API|Tipo / valores|Regla|
|---|---|---|---|
|Login gobierno|correo|email|Obligatorio.|
|Login gobierno|contrasena|string|Obligatoria; nunca se registra en logs.|
|Onboarding|tiene_automovil|boolean|Obligatorio.|
|Onboarding|propulsion|ELECTRICO \| HIBRIDO_ECHUFABLE \| HIBRIDO \| COMBUSTION \| OTRO \| SIN_AUTOMOVIL|Si `tiene_automovil=false`, debe ser `SIN_AUTOMOVIL`.|
|Onboarding|consideraria_ev|SI \| NO \| NO_SE|Obligatorio. No se usa dentro del score de Adopción.|
|Onboarding|barrera_principal|PRECIO \| CARGA \| AUTONOMIA \| INFORMACION_DUDAS \| CARACTERISTICAS_VEHICULO \| NO_INTERESA \| OTRA \| NINGUNA|Obligatorio. Señal diagnóstica, no barra directa.|
|Onboarding|consentimiento_agregado|boolean|Debe ser `true` para crear perfil analítico.|
|Onboarding|ubicacion o clave_zona|lat/lon o clave|Al menos una forma de asociación territorial. La API resuelve AGEB si recibe coordenadas.|
|Solicitud|ubicacion|latitud, longitud|Obligatoria; dentro de CDMX.|
|Solicitud|motivo|VIVO_CERCA \| TRABAJO_CERCA \| TRANSITO_FRECUENTE \| TENGO_EV \| CONSIDERARIA_EV_CON_CARGA \| OTRO|Un motivo principal.|
|Solicitud|comentario|string <= 500|Opcional. No se usa en fórmulas automáticas v1.|
|Gestión solicitud|estado|REGISTRADA \| EN_REVISION \| ATENDIDA \| DESCARTADA|Sólo Web Gobierno.|

---

## 9. Contrato final de base de datos

**Motor:** PostgreSQL + PostGIS. Los UUID son identificadores internos; la clave geográfica es el identificador público estable de zonas. La estructura siguiente es la fuente de verdad para la implementación v1.

|Tabla|Responsabilidad|Columnas contractuales|
|---|---|---|
|zonas|Territorio jerárquico CDMX/alcaldía/AGEB y geometría PostGIS.|id, clave, tipo, nombre, zona_padre_id, geometria, activa, creado_en, actualizado_en|
|fuentes_datos|Proveniencia y fecha de las fuentes.|id, clave, nombre, tipo_procedencia, referencia, fecha_referencia, fecha_descarga, notas|
|observaciones|Métricas crudas por zona y periodo.|id, zona_id, clave_metrica, valor_numerico, valor_texto, unidad, periodo, fuente_id, creado_en|
|estaciones_carga|Estaciones públicas importadas.|id, identificador_fuente, nombre, direccion, ubicacion, zona_id, fuente_id, estado_demostracion, creado_en, actualizado_en|
|conectores_carga|Grupos de conectores por estación.|id, estacion_id, numero_grupo, cantidad, tipo_conector, potencia_kw, estado_operativo, procedencia_estado|
|perfiles_ciudadanos|Perfil seudónimo de participación.|id, zona_id, tiene_automovil, propulsion, consideraria_ev, barrera_principal, consentimiento_agregado, creado_en, actualizado_en|
|solicitudes_infraestructura|Señales georreferenciadas de necesidad de carga.|id, perfil_ciudadano_id, zona_id, ubicacion, motivo, comentario, estado, creado_en, actualizado_en|
|interacciones|Acciones útiles para medir participación.|id, perfil_ciudadano_id, zona_id, tipo, metadatos, creado_en|
|evaluaciones_indicadores|Snapshots versionados de las cuatro dimensiones.|id, zona_id, dimension, puntuacion, nivel, confianza, tamano_muestra, version_formula, componentes, explicacion, calculado_en|
|recomendaciones|Snapshots de diagnóstico/reglas.|id, zona_id, barrera_principal, accion, prioridad, confianza, razones, evidencia, version_reglas, creado_en|

### 9.1 Adiciones finales requeridas antes de cerrar backend

La BD actual ya contiene las diez tablas anteriores. Para soportar el flujo final descrito en este documento se agregan únicamente estas dos tablas; no alteran la carga ETL existente.

|Tabla nueva|Columnas|Uso|
|---|---|---|
|usuarios_gobierno|id uuid PK; nombre varchar(160); correo varchar(200) UNIQUE; contrasena_hash text; rol ANALISTA\|ADMINISTRADOR; activo boolean; creado_en; actualizado_en|Login y autorización de Web Gobierno. No existe registro público de usuarios.|
|contenidos_informativos|id uuid PK; slug varchar(120) UNIQUE; título varchar(180); resumen text; contenido text; categoria varchar(80); orden integer; publicado boolean; creado_en; actualizado_en|Pantallas Lititio. Se carga por seed/migración; v1 no incluye CMS.|

**Compatibilidad:** No se renombra ninguna tabla ya cargada. Las rutas ciudadanas usan token firmado; no se requiere tabla de sesiones ciudadanas. La sesión de gobierno puede ser cookie firmada/JWT y tampoco exige una tabla adicional.

### 9.2 Relaciones principales

text

zonas 1 ---- n observaciones
zonas 1 ---- n estaciones_carga
estaciones_carga 1 ---- n conectores_carga
zonas 1 ---- n perfiles_ciudadanos
zonas 1 ---- n solicitudes_infraestructura
zonas 1 ---- n interacciones
zonas 1 ---- n evaluaciones_indicadores
zonas 1 ---- n recomendaciones
perfiles_ciudadanos 1 ---- n solicitudes_infraestructura
perfiles_ciudadanos 1 ---- n interacciones

### 9.3 Catálogos/enums que no deben divergir entre clientes

|Enum|Valores|
|---|---|
|tipo_zona|CDMX, ALCALDIA, AGEB|
|tipo_procedencia|OFICIAL, NEHNEMI, SIMULADO, DERIVADO|
|tipo_propulsion|ELECTRICO, HIBRIDO_ENCHUFABLE, HIBRIDO, COMBUSTION, OTRO, SIN_AUTOMOVIL|
|respuesta_consideracion|SI, NO, NO_SE|
|tipo_barrera_declarada|PRECIO, CARGA, AUTONOMIA, INFORMACION_DUDAS, CARACTERISTICAS_VEHICULO, NO_INTERESA, OTRA, NINGUNA|
|estado_solicitud|REGISTRADA, EN_REVISION, ATENDIDA, DESCARTADA|
|dimension_indicador|ADOPCION, INFRAESTRUCTURA, PARTICIPACION, ACCESIBILIDAD|
|nivel_indicador|MUY_BAJA, BAJA, MEDIA, ALTA|
|nivel_confianza|BAJA, MEDIA, ALTA|
|tipo_barrera_diagnosticada|INFRAESTRUCTURA, PARTICIPACION, ACCESIBILIDAD_ECONOMICA, INFORMACION, EVIDENCIA_INSUFICIENTE, SIN_CUELLO_PRIORITARIO|
|accion_recomendada|RECOPILAR_MAS_DATOS, EVALUAR_EXPANSION_CARGA, AUMENTAR_PARTICIPACION, EVALUAR_ACCESIBILIDAD_ECONOMICA, INTERVENCION_INFORMATIVA, MONITOREAR, INVESTIGAR|
|prioridad_recomendacion|BAJA, MEDIA, ALTA|

---

## 10. Datos reales ya cargados: referencia de aceptación

La validación real de PostgreSQL/PostGIS es la referencia para comprobar que futuros cambios del backend no alteren silenciosamente los datos territoriales.

|Control|Valor real|
|---|---|
|Zonas|1 CDMX + 16 alcaldías + 2,431 AGEB|
|Estaciones ubicadas dentro de AGEB CDMX|381 estaciones en 207 AGEB|
|Conectores importados|449|
|Potencia total de conectores importados|7,727.50 kW|
|Observaciones|7,249|
|Evaluaciones|4,776 = 2,388 Infraestructura + 2,388 Accesibilidad|
|Adopción/Participación territorial actual|0 evaluaciones; todavía no se inventan datos ciudadanos|

### 10.1 Tres AGEB canónicas para pruebas end-to-end

|AGEB|Alcaldía|Infraestructura|Condiciones de acceso|Evidencia real destacada|
|---|---|---|---|---|
|090050001039A|Gustavo A. Madero|10.28 · MUY_BAJA|91.42 · ALTA|0 estaciones; 0 conectores; 2,636.27 m a la estación más cercana; 1,564 viviendas con automóvil.|
|0900700014274|Iztapalapa|1.48 · MUY_BAJA|2.59 · MUY_BAJA|0 estaciones; 0 conectores; 7,978.58 m a la estación más cercana.|
|0901500010540|Cuauhtémoc|94.51 · ALTA|7.98 · MUY_BAJA|1 estación; 3 conectores; 54 kW; 318.86 m; 9.772 conectores/1,000 viviendas con auto.|

### 10.2 Ejemplo real de estación

|Campo|Valor|
|---|---|
|nombre|COPEMSA Gran Plaza|
|direccion|Palma Norte No. 37 Centro Historico|
|AGEB|0901500010540|
|coordenadas|19.4422679, -99.1342997|
|conectores|3|
|tipo|Tesla D|
|potencia por conector/grupo|18 kW|
|potencia total derivada|54 kW|

### 10.3 Ejemplo real de tendencia EV CDMX

|Periodo|Ventas de vehículos eléctricos|
|---|---|
|2026-06|629|
|2026-07|1,027|
|2026-08|679|
|2026-09 a 2026-12|Sin valor en la fuente; no se convierten en cero|

---

## 11. Recomendador v1: reglas y prioridad

El recomendador es determinista y explicable. No usa ML en v1 y nunca convierte una solicitud ciudadana en una orden automática de infraestructura.

8. Si una recomendación depende principalmente de evidencia ciudadana y la confianza es BAJA: `RECOPILAR_MAS_DATOS`.
    
9. Si Infraestructura es BAJA/MUY_BAJA y la demanda de carga es relativamente ALTA (percentil >= 75): `EVALUAR_EXPANSION_CARGA`.
    
10. Si Participación es BAJA/MUY_BAJA: `AUMENTAR_PARTICIPACION`.
    
11. Si Condiciones de acceso es BAJA/MUY_BAJA y la barrera PRECIO es relativamente ALTA: `EVALUAR_ACCESIBILIDAD_ECONOMICA`.
    
12. Si Adopción es BAJA/MUY_BAJA, Infraestructura al menos MEDIA, hay participación suficiente y barreras informativas altas: `INTERVENCION_INFORMATIVA`.
    
13. Si no existe cuello prioritario o las señales se contradicen: `MONITOREAR` o `INVESTIGAR`.
    

**Interpretación:** Una zona con condiciones de acceso altas e infraestructura baja es una candidata de observación. Sólo con evidencia ciudadana suficiente se eleva la recomendación a evaluar expansión de carga.

---

## 12. Contrato final de API v1

**Base:** `/api/v1`. JSON en snake_case. Nombres de dominio en español. Las rutas siguientes son el conjunto final de v1; los frontends deben desarrollarse contra ellas y no crear rutas ad hoc.

|Método|Ruta|Consumidor|Auth|Respuesta principal|
|---|---|---|---|---|
|GET|`/salud`|Todos|No|estado, servicio, version|
|POST|`/autenticacion/iniciar-sesion`|Web Gobierno|No|usuario; establece cookie de sesión|
|GET|`/autenticacion/sesion`|Web Gobierno|Gobierno|autenticado, usuario|
|POST|`/autenticacion/cerrar-sesion`|Web Gobierno|Gobierno|cerrada|
|GET|`/panorama`|Web Gobierno|Gobierno|territorio, infraestructura, distribuciones, participación, solicitudes, ventas_ev, zonas_prioritarias|
|GET|`/zonas`|Web/Móvil|No|zonas[]|
|GET|`/zonas/mapa`|Web Gobierno|Gobierno|FeatureCollection GeoJSON|
|GET|`/zonas/{clave_zona}/resumen`|Web Gobierno|Gobierno|zona, indicadores, señales, infraestructura, diagnóstico, calidad_datos|
|GET|`/zonas/{clave_zona}/indicadores`|Web Gobierno|Gobierno|indicadores[]|
|GET|`/zonas/{clave_zona}/senales`|Web Gobierno|Gobierno|participación, barreras, intención_ev, demanda_carga|
|GET|`/zonas/{clave_zona}/solicitudes`|Web Gobierno|Gobierno|total, por_estado, tendencia, motivos|
|GET|`/zonas/{clave_zona}/recomendaciones`|Web Gobierno|Gobierno|recomendaciones[]|
|POST|`/zonas/{clave_zona}/evaluar`|Backend/Web admin|Administrador|evaluación_actualizada, recomendación|
|GET|`/estaciones-carga`|Móvil/Web|No|estaciones[], paginación|
|GET|`/estaciones-carga/{estacion_id}`|Móvil/Web|No|estación, conectores, disponibilidad_tiempo_real|
|GET|`/tendencias/electromovilidad`|Web Gobierno|Gobierno|series[]|
|GET|`/fuentes-datos`|Web Gobierno|Gobierno|fuentes[]|
|GET|`/contenidos`|Móvil|No|contenidos[]|
|GET|`/contenidos/{slug}`|Móvil|No|contenido|
|POST|`/ciudadanos`|Móvil|No|perfil, token_ciudadano|
|GET|`/ciudadanos/mi-perfil`|Móvil|Ciudadano|perfil|
|PATCH|`/ciudadanos/mi-perfil`|Móvil|Ciudadano|perfil_actualizado|
|DELETE|`/ciudadanos/mi-perfil`|Móvil|Ciudadano|eliminado|

### 12.1 Convenciones comunes

- Zonas se identifican en la URL por clave geográfica estable (ej. `090050001039A`); el UUID de PostgreSQL es interno.
    
- Fechas y timestamps en ISO-8601.
    
- Puntuaciones redondeadas a dos decimales; componentes conservan la precisión necesaria.
    
- Listados operativos paginados usan `datos[]` y `paginacion {pagina, tamano, total}`.
    
- Errores tienen una sola forma: `error.codigo`, `error.mensaje` y `error.detalles`.
    
- Disponibilidad en tiempo real de estaciones: `false` mientras no exista fuente verificada.
    
- Procedencia de cada dato: OFICIAL, NEHNEMI, SIMULADO o DERIVADO.
    

json

{
  "error": {
    "codigo": "DATOS_INVALIDOS",
    "mensaje": "La ubicación debe encontrarse dentro de Ciudad de México.",
    "detalles": {
      "campo": "ubicacion"
    }
  }
}

### 12.2 Respuesta: GET /zonas/{clave_zona}/resumen

json

{
  "zona": {
    "clave": "090050001039A",
    "tipo": "AGEB",
    "nombre": "AGEB 039A",
    "zona_padre": {
      "clave": "09005",
      "nombre": "Gustavo A. Madero"
    }
  },
  "indicadores": {
    "adopcion": {
      "disponible": false,
      "puntuacion": null,
      "nivel": null,
      "confianza": "BAJA",
      "motivo_no_disponible": "SIN_EVIDENCIA_CIUDADANA"
    },
    "infraestructura": {
      "disponible": true,
      "puntuacion": 10.28,
      "nivel": "MUY_BAJA",
      "confianza": "ALTA",
      "version_formula": "INFRAESTRUCTURA_VI",
      "componentes": {
        "distancia_estacion_m": 2636.27,
        "cobertura_score": 20.57,
        "estaciones_en_zona": 0,
        "conectores_en_zona": 0,
        "potencia_total_kw": 0.0,
        "conectores_por_1000_viviendas_auto": 0.0,
        "capacidad_score": 0.0
      }
    }
  }
}

### 12.3 Respuesta: GET /estaciones-carga/{estacion_id}

json

{
  "id": "<uuid>",
  "nombre": "COPEMSA Gran Plaza",
  "direccion": "Palma Norte No. 37 Centro Historico",
  "ubicacion": {
    "latitud": 19.4422679,
    "longitud": -99.1342997
  },
  "zona": {
    "clave": "0901500010540",
    "nombre": "AGEB 0540"
  },
  "conectores": [
    {
      "numero_grupo": 1,
      "cantidad": 3,
      "tipo_conector": "Tesla D",
      "potencia_kw": 18.0
    }
  ],
  "potencia_total_kw": 54.0,
  "disponibilidad_tiempo_real": {
    "disponible": false,
    "motivo": "FUENTE_SIN_ESTADO_EN_TIEMPO_REAL"
  },
  "procedencia": "OFICIAL"
}

### 12.4 Solicitud/respuesta: POST /ciudadanos

json

{
  "tiene_automovil": true,
  "propulsion": "COMBUSTION",
  "consideraria_ev": "SI",
  "barrera_principal": "CARGA",
  "consentimiento_agregado": true,
  "ubicacion": {
    "latitud": 19.43,
    "longitud": -99.13
  }
}

Respuesta 201:

json

{
  "perfil": {
    "id": "<uuid>",
    "zona": {
      "clave": "0901500010540",
      "nombre": "AGEB 0540"
    },
    "tiene_automovil": true,
    "propulsion": "COMBUSTION",
    "consideraria_ev": "SI",
    "barrera_principal": "CARGA"
  },
  "