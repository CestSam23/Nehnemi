# NEHNEMI

**Contrato técnico de integración — estado implementado, comparativa v1.0 y evidencias**

Corte: 8 de octubre de 2026 \| Referencia: GitHub CestSam23/nehnemi_backend, rama main; contrato funcional-técnico v1.0 del 6 de octubre; pruebas locales aportadas por el equipo.

Naturaleza: documento de constatación y brechas. NO sustituye silenciosamente el contrato congelado v1.0. Las divergencias requieren aprobación o adaptación de implementación.

# 1. Alcance y fuentes de verdad

Backend: FastAPI + SQLAlchemy + PostgreSQL/PostGIS; prefijo /api/v1 salvo GET /health. Autenticación gubernamental por cookie JWT; ciudadana por Bearer JWT. Datos territoriales mediante ETL y evaluaciones por zona. El código de GitHub prueba definición de rutas y validaciones; solo los JSON mostrados durante las pruebas locales se califican como respuestas observadas.

Fuentes inspeccionadas: app/main.py; app/routes/\*.py; app/schemas/\*.py; app/services/{analisis_territorial,indicadores,diagnostico,panorama_ampliado,autenticacion_ciudadano}.py; ETL/cargar_datos.py; database.sql; migraciones/001_contrato_final.sql. Documento anterior adjunto (19 páginas).

URL de referencia: https://github.com/CestSam23/nehnemi_backend . El estado local puede diferir si hay cambios sin subir; la evidencia del panorama local aportada corresponde al 08/10/2026.

# 2. Inventario de rutas implementadas

| Método | Ruta (prefijo /api/v1 salvo /health)        | Acceso real     | Función / respuesta                                                             |
|--------|---------------------------------------------|-----------------|---------------------------------------------------------------------------------|
| GET    | /health                                     | Público         | Diagnóstico DB; respuesta {estado:"ok",base_datos:"conectada"}.                 |
| POST   | /autenticacion/iniciar-sesion               | Público         | Body correo, contrasena; cookie 30 min; devuelve id,nombre,correo,rol.          |
| GET    | /autenticacion/sesion                       | Gobierno        | Devuelve id,nombre,correo,rol.                                                  |
| POST   | /autenticacion/cerrar-sesion                | Público\*       | 204; borra cookie; no exige autenticación.                                      |
| GET    | /panorama                                   | Público\*       | Panorama ampliado con 10 bloques, ventas mensuales y recomendaciones recientes. |
| GET    | /zonas                                      | Público         | Filtros tipo, zona_padre, buscar; array directo.                                |
| GET    | /zonas/mapa                                 | Público\*       | Requiere tipo y dimension; GeoJSON FeatureCollection.                           |
| GET    | /zonas/{clave}                              | Público         | Detalle de zona, activa. Ruta adicional respecto de v1.0.                       |
| GET    | /zonas/{clave}/indicadores                  | Público\*       | Cuatro dimensiones en indicadores\[\].                                          |
| GET    | /zonas/{clave}/resumen                      | Público\*       | Resumen reducido; infraestructura + indicadores.                                |
| GET    | /zonas/{clave}/senales                      | Público\*       | Señales derivadas de indicadores, no conteos ciudadanos crudos.                 |
| GET    | /zonas/{clave}/solicitudes                  | Público\*       | Totales por estado y motivo.                                                    |
| GET    | /zonas/{clave}/recomendaciones              | Gobierno        | Últimas 30 recomendaciones persistidas.                                         |
| POST   | /zonas/{clave}/evaluar                      | Administrador   | Recalcula ciudadanos y genera recomendación persistida.                         |
| GET    | /tendencias/electromovilidad                | Gobierno        | Serie de VENTAS_EV CDMX; puntos con periodo/valor/unidad/fuente.                |
| GET    | /estaciones-carga                           | Público         | Lista directa con filtros, sin paginación.                                      |
| GET    | /estaciones-carga/{estacion_id}             | Público         | Detalle por UUID, conectores; estructura plana.                                 |
| GET    | /fuentes-datos                              | Público\*       | Lista directa fuentes y procedencia.                                            |
| GET    | /contenidos                                 | Público         | Contenidos publicados, array directo.                                           |
| GET    | /contenidos/{slug}                          | Público         | Detalle contenido; 404 si no existe/publicado.                                  |
| POST   | /ciudadanos                                 | Público         | 201; crea perfil y emite token.                                                 |
| GET    | /ciudadanos/mi-perfil                       | Ciudadano       | Datos de perfil con zona_clave.                                                 |
| PATCH  | /ciudadanos/mi-perfil                       | Ciudadano       | Campos opcionales; al menos uno; no null.                                       |
| DELETE | /ciudadanos/mi-perfil                       | Ciudadano       | 204; elimina perfil, sus solicitudes e interacciones.                           |
| GET    | /ciudadanos/mis-solicitudes                 | Ciudadano       | Array directo con solicitudes propias.                                          |
| POST   | /solicitudes-infraestructura                | Ciudadano       | 201; resuelve AGEB, punto y motivo.                                             |
| GET    | /solicitudes-infraestructura                | Gobierno        | Filtros + paginación {total,pagina,limite,solicitudes}.                         |
| GET    | /solicitudes-infraestructura/{solicitud_id} | Gobierno\*      | Detalle administrativo, no acceso ciudadano demostrado.                         |
| PATCH  | /solicitudes-infraestructura/{solicitud_id} | Administrador\* | Actualiza estado de solicitud.                                                  |
| POST   | /interacciones                              | Ciudadano       | 201; registra tipo/metadatos y zona del perfil.                                 |

\* Diferencia frente al contrato antiguo: algunos GET territoriales y /panorama no tienen dependencia de gobierno; PATCH solicitudes exige ADMINISTRADOR; detalle de solicitud no acepta Bearer ciudadano; cerrar sesión no valida cookie.

# 3. Parámetros, formularios y validaciones

| Operación                                 | Parámetros verificados en código                                                                                                                 | Observaciones                                                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| GET /zonas                                | tipo=CDMX\|ALCALDIA\|AGEB; zona_padre texto; buscar texto                                                                                        | Filtros opcionales; lista sin paginar.                                                             |
| GET /zonas/mapa                           | tipo=ALCALDIA\|AGEB; dimension=ADOPCION\|INFRAESTRUCTURA\|PARTICIPACION\|ACCESIBILIDAD                                                           | Ambos query obligatorios.                                                                          |
| GET /estaciones-carga                     | clave_zona, buscar, latitud\[-90,90\], longitud\[-180,180\], radio_km(0,100\]                                                                    | Si radio_km existe requiere ambas coordenadas; búsqueda ILIKE.                                     |
| GET /solicitudes-infraestructura          | pagina\>=1 default1; limite 1..100 default20; estado; clave_zona                                                                                 | Estados: REGISTRADA, EN_REVISION, ATENDIDA, DESCARTADA.                                            |
| POST /ciudadanos                          | tiene_automovil bool; propulsion; consideraria_ev; barrera_principal; consentimiento_agregado bool; ubicacion o clave_zona opcionales en esquema | No aparece validador de consentimiento=true ni de vínculo obligatorio a zona; diferencia material. |
| PATCH /ciudadanos/mi-perfil               | Cualquiera de los campos anteriores; ubicacion o clave_zona para modificar zona                                                                  | Body no vacío y sin null explícito; zona por clave o punto.                                        |
| POST /solicitudes-infraestructura         | ubicacion{latitud,longitud}; motivo; comentario opcional\<=500                                                                                   | Bearer; coordenadas geográficas válidas y resolución AGEB en CDMX.                                 |
| PATCH /solicitudes-infraestructura/{UUID} | estado enum                                                                                                                                      | Solo administrador; no se observó máquina de transiciones de estados.                              |
| POST /interacciones                       | tipo string 1..80; metadatos objeto default {}                                                                                                   | No existe catálogo cerrado de tipos en esquema.                                                    |
| POST /autenticacion/iniciar-sesion        | correo string; contrasena string                                                                                                                 | No se valida formato email en Pydantic; normaliza correo al consultar.                             |

Enums principales: propulsion ELECTRICO\|HIBRIDO_ENCHUFABLE\|HIBRIDO\|COMBUSTION\|OTRO\|SIN_AUTOMOVIL; consideraria_ev SI\|NO\|NO_SE; barrera PRECIO\|CARGA\|AUTONOMIA\|INFORMACION_DUDAS\|CARACTERISTICAS_VEHICULO\|NO_INTERESA\|OTRA\|NINGUNA; motivo VIVO_CERCA\|TRABAJO_CERCA\|TRANSITO_FRECUENTE\|TENGO_EV\|CONSIDERARIA_EV_CON_CARGA\|OTRO.

# 4. Respuestas observadas localmente (no ilustrativas)

## GET /api/v1/panorama — estructura y cifras reales

{

"fecha_actualizacion":"2026-10-08T18:24:49.088098+00:00",

"cobertura_territorial":{"alcaldias":16,"agebs":2431},

"fuentes_documentadas":5,

"dimensiones":{"ADOPCION":{"disponible":false,"motivo":"Sin datos territoriales suficientes"},"INFRAESTRUCTURA":{"disponible":true},"PARTICIPACION":{"disponible":false,"motivo":"Sin evaluación territorial consolidada"},"ACCESIBILIDAD":{"disponible":true}},

"territorio":{"alcaldias":16,"agebs":2431},

"infraestructura":{"estaciones_registradas":381,"conectores_registrados":1021,"potencia_total_kw":31694.5,"estado_operativo_verificado":false},

"distribuciones":{"INFRAESTRUCTURA":{"disponibles":2388,"sin_datos":43,"niveles":{"MUY_BAJA":1200,"BAJA":985,"MEDIA":2,"ALTA":201}},"ACCESIBILIDAD":{"disponibles":2388,"sin_datos":43,"niveles":{"MUY_BAJA":531,"BAJA":702,"MEDIA":579,"ALTA":576}},"ADOPCION":{"disponibles":0,"sin_datos":2431,"niveles":{"MUY_BAJA":0,"BAJA":0,"MEDIA":0,"ALTA":0}},"PARTICIPACION":{"disponibles":0,"sin_datos":2431,"niveles":{"MUY_BAJA":0,"BAJA":0,"MEDIA":0,"ALTA":0}}},

"participacion":{"ciudadanos_registrados":1,"ciudadanos_consentimiento_agregado":1,"interacciones_registradas":0,"solicitudes_registradas":2},

"solicitudes":{"total":2,"por_estado":{"REGISTRADA":2,"EN_REVISION":0,"ATENDIDA":0,"DESCARTADA":0}},

"ventas_ev":{"ambito":"CDMX","ultimo_periodo":"2026-08","ultimo_valor":679.0,"periodos_disponibles":20},

"zonas_prioritarias":\[{"clave_zona":"090050001039A","nombre_zona":"AGEB 039A","recomendacion_id":4,"barrera_principal":"EVIDENCIA_INSUFICIENTE","accion":"RECOPILAR_MAS_DATOS","prioridad":"MEDIA","confianza":"BAJA","creado_en":"2026-10-08T12:21:34.325817-06:00"}\]

}

La captura real incluye también ventas_ev.serie_mensual con 20 observaciones; se omite únicamente su repetición aquí. Últimos puntos comprobados: 2026-06=629, 2026-07=1027, 2026-08=679.

Diferencia de versión: el archivo actual de GitHub añade infraestructura.potencia_nominal_agregada_kw y metodologia_potencia, que no figuraban en la respuesta local copiada. Verificar con curl la revisión desplegada antes de fijar JSON definitivo.

## POST /api/v1/solicitudes-infraestructura — 201 observado

{"id":"a0bebc9c-1b87-48fd-a41a-d7550173cfae","zona_clave":"090050001039A","motivo":"CONSIDERARIA_EV_CON_CARGA","estado":"REGISTRADA"}

## POST /api/v1/zonas/090050001039A/evaluar — respuesta observada

{"zona_clave":"090050001039A","evaluacion_actualizada":{"dimensiones_recalculadas":\[\],"participantes_validos":1,"confianza":"BAJA","motivo":"MUESTRA_OPERATIVA_INSUFICIENTE"},"recomendacion":{"id":3,"barrera_principal":"EVIDENCIA_INSUFICIENTE","accion":"RECOPILAR_MAS_DATOS","prioridad":"MEDIA","confianza":"BAJA","version_reglas":"RECOMENDACIONES_V1"}}

La respuesta real también incluyó creado_en, razones y evidencia (solicitudes_activas:1, percentil_demanda:99.96, demanda_por_1000_viviendas:0.5470459518599562, participantes_validos:1, puntuaciones INFRAESTRUCTURA 10.28 y ACCESIBILIDAD 91.42). Son valores del momento de aquella evaluación; el panorama posterior refleja 2 solicitudes y recomendación id 4.

GET /api/v1/zonas?tipo=ALCALDIA devolvió 16 alcaldías; GET /zonas/mapa?tipo=ALCALDIA&dimension=INFRAESTRUCTURA devolvió FeatureCollection de 16 features; GET /zonas/0901500010540/indicadores reportó INFRAESTRUCTURA 94.51, ALTA, confianza ALTA. Estas pruebas se documentan por sus hechos verificados, no se reconstruye un JSON no capturado.

# 5. Contratos de respuesta inferibles exactamente del código (sin afirmar ejecución)

| Ruta                               | Forma JSON publicada por el código                                                                                                                |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| /autenticacion/iniciar-sesion      | {id,nombre,correo,rol}; Set-Cookie: nehneni_sesion.                                                                                               |
| /ciudadanos                        | {id,token,zona_clave}; HTTP 201. No {perfil,token_ciudadano}.                                                                                     |
| /ciudadanos/mi-perfil              | {id,zona_clave,tiene_automovil,propulsion,consideraria_ev,barrera_principal,consentimiento_agregado}.                                             |
| /ciudadanos/mis-solicitudes        | \[{id,zona_clave,motivo,comentario,estado,creado_en,ubicacion:{latitud,longitud}}, ...\].                                                         |
| /solicitudes-infraestructura (GET) | {total,pagina,limite,solicitudes:\[{id,zona_clave,motivo,comentario,estado,creado_en},...\]}.                                                     |
| /solicitudes-infraestructura/{id}  | {id,zona_clave,motivo,comentario,estado,creado_en}.                                                                                               |
| /zonas                             | \[{clave,tipo,nombre,zona_padre_clave},...\].                                                                                                     |
| /zonas/{clave}/indicadores         | {zona_clave,indicadores:\[{dimension,disponible,puntuacion,nivel,confianza,tamano_muestra,componentes,explicacion},...\]}.                        |
| /zonas/{clave}/resumen             | {clave,tipo,nombre,zona_padre_clave,indicadores,infraestructura:{estaciones,conectores,potencia_total_kw,distancia_estacion_m}\|null}.            |
| /zonas/{clave}/senales             | {zona_clave,senales:\[{codigo,categoria,valor,unidad,descripcion},...\]}.                                                                         |
| /zonas/{clave}/solicitudes         | {zona_clave,total,por_estado:\[{valor,cantidad}\],por_motivo:\[{valor,cantidad}\]}.                                                               |
| /zonas/mapa                        | {type:"FeatureCollection",features:\[{type:"Feature",geometry,properties:{clave,tipo,nombre,dimension,disponible,puntuacion,nivel,confianza}}\]}. |
| /estaciones-carga                  | \[{id,identificador,nombre,direccion,ubicacion,estado_demostracion,conectores:\[{cantidad,tipo_conector,potencia_kw,estado_operativo}\]}\].       |
| /estaciones-carga/{id}             | {id,nombre,direccion,latitud,longitud,zona_clave,conectores:\[{tipo_conector,cantidad,potencia_kw,estado_operativo}\]}.                           |
| /contenidos                        | \[{id,slug,titulo,resumen,categoria,orden},...\] solo publicados.                                                                                 |
| /contenidos/{slug}                 | {id,slug,titulo,resumen,categoria,orden,contenido,creado_en}.                                                                                     |
| /fuentes-datos                     | \[{id,clave,nombre,tipo_procedencia,referencia,fecha_referencia,fecha_descarga,notas}\].                                                          |
| /interacciones                     | {id,tipo}; 201.                                                                                                                                   |
| /tendencias/electromovilidad       | {series:\[{clave_metrica,zona_clave,fuente,puntos:\[{periodo,valor,unidad,fuente}\]}\],disponible}.                                               |
| /zonas/{clave}/recomendaciones     | {zona_clave,recomendaciones:\[{id,barrera_principal,accion,prioridad,confianza,razones,evidencia,version_reglas,creado_en},...\]}; max 30.        |

Error nativo actual: FastAPI HTTPException responde generalmente {"detail":"mensaje"}; error de Pydantic/validación 422 responde {"detail":\[...\]} y no el sobre contractual {"error":{"codigo","mensaje","detalles"}}. Estados específicos deben verificarse en pruebas de integración, no atribuirse como observados.

# 6. Matriz de diferencias frente al contrato original v1.0

| Tema                   | Contrato original                                                      | Estado actual en GitHub                                                             | Decisión / riesgo                                            |
|------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------|
| Salud                  | GET /api/v1/salud                                                      | GET /health                                                                         | Desviación de ruta.                                          |
| Login                  | Objeto usuario / cookie                                                | Objeto plano / cookie                                                               | Desviación de forma.                                         |
| Sesión y panorama      | Gobierno                                                               | Panorama sin auth                                                                   | Revisar privacidad/intención.                                |
| Zonas mapa             | Gobierno; propiedades alcaldia                                         | Público; sin alcaldia                                                               | Autorización/GeoJSON diferente.                              |
| Resumen zona           | zona,indicadores,senales,infraestructura,diagnostico,calidad_datos     | clave,tipo,nombre,zona_padre_clave,indicadores\[\],infraestructura                  | Cambio estructural relevante.                                |
| Indicadores            | Respuesta contractual detallada                                        | Lista con campos schema; carece version_formula                                     | Revisar frontend.                                            |
| Señales                | Participación, barreras, intención y demanda                           | Lista de señales diagnósticas basadas en indicadores                                | No sustituye agregados ciudadanos.                           |
| Panorama               | Conectores 449 / potencia 7,727.5 / formas simplificadas               | 1021 conectores (SUM cantidad) / 31,694.5 kW nominales estimados / formas ampliadas | 449 es número de grupos; conflicto semántico corregido.      |
| Estaciones listado     | Paginación prevista                                                    | Array directo, sin paginación                                                       | Riesgo de carga; diferencias UI.                             |
| Estación detalle       | ubicacion anidada, zona objeto, disponibilidad_tiempo_real             | latitud,longitud,zona_clave plano, sin disponibilidad_tiempo_real                   | No atribuir disponibilidad real.                             |
| Registro ciudadano     | {perfil,token_ciudadano}; consentimiento true y asociación obligatoria | {id,token,zona_clave}; schema permite consentimiento false y sin zona               | Incumplimiento funcional de validaciones.                    |
| Crear solicitud        | {solicitud,zona_resuelta}                                              | {id,zona_clave,motivo,estado}                                                       | Consumidor debe adaptar.                                     |
| Detalle solicitud      | Propietario/Gobierno                                                   | Solo cookie gobierno                                                                | Flujo móvil debe usar mis-solicitudes.                       |
| Cambio estado          | Gobierno                                                               | Solo ADMINISTRADOR                                                                  | Diferencia de permisos.                                      |
| Eliminar perfil        | Desvincula solicitudes para mantener estadísticas                      | Borra solicitudes e interacciones propias                                           | Incompatibilidad estratégica/privacidad.                     |
| Listas operativas      | datos\[\] y paginacion{pagina,tamano,total}                            | solicitudes\[\],total,pagina,limite                                                 | Contrato de paginación divergente.                           |
| Errores                | error.codigo,error.mensaje,error.detalles                              | detail FastAPI                                                                      | Compatibilidad de cliente.                                   |
| Zonas adicionales      | Contrato no contempló GET /zonas/{clave}                               | Implementado                                                                        | Ruta añadida.                                                |
| Históricos indicadores | Actuales o históricos                                                  | Solo actuales en GET                                                                | Histórico almacenado pero no expuesto.                       |
| ETL carga normal       | No borrar datos ciudadanos                                             | Opción reiniciar=True hace TRUNCATE de ciudadanos y solicitudes                     | Precaución operativa; no ejecutar reinicio sobre producción. |

La matriz no modifica el contrato congelado: registra discrepancias para una decisión explícita del equipo. Recomendación: usar en frontend el contrato observado/código como adaptador temporal, y escoger qué desviaciones se corrigen en backend antes de declarar release v1.0.

# 7. Decisiones estratégicas y metodología

| Decisión                     | Justificación y consecuencia                                                                                                                                                 |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cuatro barras independientes | No hay score global; evita falsa agregación. Cada dimensión 0–100 y nivel MUY_BAJA/BAJA/MEDIA/ALTA.                                                                          |
| Percentil estricto           | 100 × proporción de zonas válidas con métrica menor; distancia invertida. Comparaciones relativas, no absolutos de suficiencia.                                              |
| Infraestructura              | 0.5 cobertura + 0.5 capacidad; cobertura por distancia euclidiana desde centroide AGEB; capacidad por conectores/1000 viviendas con automóvil.                               |
| Accesibilidad                | 0.5 IDS score + 0.5 tenencia automóvil score; no representa capacidad adquisitiva individual ni precio de EV.                                                                |
| Ciudadanos                   | Adopción y Participación no disponibles sin datos suficientes; \<30 participantes implica confianza BAJA. Para adopción el código exige además \>=30 con automóvil.          |
| Solicitudes                  | Demanda declarada voluntariamente, no orden de instalación; no representa muestreo poblacional.                                                                              |
| Recomendador                 | Determinista, persistido mediante POST admin; confianza baja prioriza RECOPILAR_MAS_DATOS cuando hay solicitudes/infraestructura baja.                                       |
| Potencia                     | SUM(cantidad × potencia_kw)=31,694.5 kW en prueba; estimación nominal agregada, no potencia simultánea disponible.                                                           |
| Fuente de potencia           | CSV Electrolineras columnas cargadores_01..05, potencia_01..05. Cuatro grupos VEMO (41,41,34,32 cargadores a 96 kW) coinciden CSV-ETL-BD.                                    |
| Privacidad                   | Perfiles seudónimos; zona del perfil; punto exacto solo para solicitudes. Código actual DELETE borra solicitudes asociadas; pendiente reconciliar con retención agregada v1. |
| Información pública          | Lititio ofrece contenidos editoriales, no generación IA en tiempo real.                                                                                                      |
| Fuentes oficiales            | 20 puntos ventas EV CDMX 2025-01 a 2026-08; meses posteriores ausentes ≠ 0.                                                                                                  |

El código del servicio de análisis confirma niveles (\<25, \<50, \<75, \>=75), confianza (\<30, \<100, \>=100) y guardas de ciudadanía. Nota técnica: con una única zona comparable, el percentil estricto puede devolver 0 incluso con valores positivos; no debe interpretarse como incidencia nula.

El percentil alto de demanda (99.96) con una sola solicitud solo refleja predominio de zonas con cero solicitudes; NO es evidencia de demanda alta representativa.

# 8. Datos de aceptación y límites de calidad

| Comprobación                 | Resultado confirmado / contexto                                                                            |
|------------------------------|------------------------------------------------------------------------------------------------------------|
| Zonas                        | 1 CDMX, 16 alcaldías, 2431 AGEB.                                                                           |
| Estaciones                   | 381; cargadores: 449 grupos, 1021 unidades agregadas.                                                      |
| Potencia                     | SUM potencia_kw: 7727.5 (suma de valores de grupo); SUM cantidad×potencia_kw:31694.5 (estimación nominal). |
| Indicadores                  | 2388 infraestructura y 2388 accesibilidad; 43 AGEB sin datos cada una.                                     |
| Infraestructura distribución | 1200 MUY_BAJA,985 BAJA,2 MEDIA,201 ALTA.                                                                   |
| Accesibilidad distribución   | 531 MUY_BAJA,702 BAJA,579 MEDIA,576 ALTA.                                                                  |
| Ciudadanía al corte local    | 1 perfil,1 consentimiento agregado,0 interacciones,2 solicitudes REGISTRADA.                               |
| Recomendaciones              | AGEB 090050001039A: acción recopilar más datos, prioridad MEDIA, confianza BAJA; última id4.               |
| Ventas oficiales             | 20 meses; último 2026-08=679; no extrapolar meses.                                                         |
| Fuentes                      | 5 documentadas en panorama.                                                                                |

Limitaciones: no hay disponibilidad en vivo de estaciones; no hay georreferenciación vial/tiempos de manejo; los 43 AGEB sin indicadores no se pintan con cero; indicadores de ciudadanos sin muestra suficiente no se computan; el dataset de cargadores no acredita potencia compartida o capacidad simultánea; no existen decisiones automáticas de obra pública.

# 9. Riesgos técnicos identificados y prioridades de corrección

| Prioridad | Hallazgo                                                                                                                               | Acción sugerida (no ejecutada)                                                                               |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Alta      | DELETE ciudadano borra interacciones y solicitudes, contrario a retener señales anonimizadas.                                          | Definir política legal/producto; decidir conservación anonimizada o borrado total; actualizar contrato y QA. |
| Alta      | Consentimiento=false y onboarding sin zona aceptados por schema actual, pese a contrato anterior.                                      | Definir opción válida y añadir validadores o enmendar reglas.                                                |
| Alta      | El endpoint detalle solicitud es solo gobierno, aunque v1 permite propietario.                                                         | Habilitar control por propietario o hacer que móvil consuma exclusivamente mis-solicitudes.                  |
| Alta      | Errores públicos no tienen la envoltura pactada.                                                                                       | Implementar handlers o adoptar oficialmente detail de FastAPI.                                               |
| Media     | Mapa/indicadores/resumen/panorama accesibles sin auth gobierno.                                                                        | Decidir si son públicos y explicitar modelo de acceso.                                                       |
| Media     | La vista indicadores_actuales mantiene snapshots anteriores si muestra después cae; evaluar_ciudadanos no los invalida con fila nueva. | Revisar consistencia tras borrados y caída de muestra con prueba real.                                       |
| Media     | Panorama GitHub versus JSON local: metadatos potencia añadidos.                                                                        | Repetir curl y verificar commit desplegado.                                                                  |
| Media     | Paginación y payload estaciones difieren del contrato.                                                                                 | Fijar adaptación de frontend o migración de respuesta antes de congelar.                                     |
| Media     | Distribuciones aparecen sobre índices poblacionales relativos, no dictámenes de viabilidad técnica.                                    | Mensajes UI y notas metodológicas obligatorias.                                                              |
| Baja      | POST logout no valida cookie y PUT/PATCH solicitudes no valida transición.                                                             | Definir si es aceptado en MVP y probar estados.                                                              |

# 10. Pruebas adicionales para cerrar el contrato sin suposiciones

Estas verificaciones no se han ejecutado desde esta sesión contra tu FastAPI local; el repo proporciona la definición y las pruebas anteriores solo parte de las respuestas. No compartas JWT, cookies ni contraseñas.

\# Inventario exacto OpenAPI (sin credenciales):

curl -sS http://127.0.0.1:8000/openapi.json \> /tmp/nehnemi_openapi.json

python - \<\<'PY'

import json

s=json.load(open('/tmp/nehnemi_openapi.json'))

for p,ops in sorted(s\['paths'\].items()):

for m,o in ops.items():

if m in ('get','post','patch','delete','put'):

print(m.upper(),p,'status=',sorted(o.get('responses',{})))

PY

\# Ruta sensible - solo metadata, NO compartir cookies ni tokens:

git rev-parse HEAD

git status --short

\# Verificaciones GET que no mutan, reutilizar cookie local:

curl -sS -b cookies.txt 'http://127.0.0.1:8000/api/v1/zonas/090050001039A/resumen' \| python -m json.tool

curl -sS -b cookies.txt 'http://127.0.0.1:8000/api/v1/zonas/090050001039A/senales' \| python -m json.tool

curl -sS -b cookies.txt 'http://127.0.0.1:8000/api/v1/tendencias/electromovilidad' \| python -m json.tool

curl -sS -b cookies.txt 'http://127.0.0.1:8000/api/v1/panorama' \| python -c 'import json,sys; print(json.load(sys.stdin)\["infraestructura"\])'

Para una auditoría final de permisos, enviar códigos HTTP y cuerpos de errores de rutas autorizadas SIN compartir credenciales. Evitar POST /evaluar o solicitudes duplicadas solo por probar si no se desea crear nuevos snapshots o registros.

# 11. Gobierno del contrato y criterio de cierre

Estado recomendado: “v1.0 implementada con diferencias contractuales identificadas; integración frontend condicionada a resolución de brechas altas”. Este documento es una especificación verificable de AS-IS y propuesta de conciliación, no un anuncio de compatibilidad total con el documento congelado.

Decisiones abiertas que sí requieren aprobación: política de eliminación de datos ciudadanos; obligatoriedad real del consentimiento y asociación territorial; visibilidad pública o gubernamental de mapa/panorama/resumen; contrato definitivo de errores; formato de estación/solicitudes y paginación. Se recomienda formalizar acta de cambios sin renombrar rutas unilateralmente.

Referencias: contrato original Nehnemi_Contrato_Funcional_Tecnico_Final_v1.0 (06/10/2026); GitHub https://github.com/CestSam23/nehnemi_backend; pruebas locales compartidas 08/10/2026.

# 12. Adenda de auditoría local — 8 de octubre de 2026

Evidencia: OUTPUTAUDITORIA.txt, proporcionado por el equipo tras ejecutar los comandos de la sección 10. La evidencia complementa, no sustituye, los esquemas del repositorio. No se han realizado pruebas adicionales desde este documento.

## 12.1 Inventario y versión auditados

OpenAPI devolvió 31 combinaciones método/ruta, incluida GET /health. El hash local reportado fue 040226cbfb9fbc7fab598f311d5fd51700b5bf16. git status --short mostró únicamente ?? OUTPUTAUDITORIA.txt. Esto indica que no había cambios rastreados sin confirmar en ese árbol de trabajo, pero no acredita por sí solo que el commit sea idéntico al remoto actual.

Los códigos listados por OpenAPI (200, 201, 204 y 422 según ruta) son respuestas DOCUMENTADAS en el esquema, no una prueba de que se hayan ejecutado todas las rutas ni de que 401, 403 y 404 no puedan producirse.

## 12.2 GET /zonas/090050001039A/resumen — observado

Zona: AGEB 039A; clave 090050001039A; zona padre 09005. ADOPCION y PARTICIPACION no disponibles (puntuacion, nivel, confianza, componentes y explicacion null). INFRAESTRUCTURA disponible: 10.28, MUY_BAJA, confianza ALTA; capacidad_score 0.0, cobertura_score 20.57, estaciones 0, conectores 0, potencia 0.0 kW, distancia_estacion_m 2636.27. ACCESIBILIDAD disponible: 91.42, ALTA, confianza ALTA; IDS 0.9544, ids_score 90.75, tenencia_score 92.09, tenencia_automovil 0.85558, viviendas_habitadas 1828, viviendas_con_automovil 1564. Bloque infraestructura: estaciones 0, conectores 0, potencia_total_kw 0.0, distancia_estacion_m 2636.27.

## 12.3 GET /zonas/090050001039A/senales — observado

Se recibieron 8 códigos: SIN_INFRAESTRUCTURA_LOCAL; SIN_CONECTORES_LOCALES; DISTANCIA_CARGA_ELEVADA (2636.27 m); INFRAESTRUCTURA_BAJA (10.28 puntos); ALTA_TENENCIA_AUTOMOVIL (85.56 %); VIVIENDAS_CON_AUTOMOVIL (1564); SIN_EVIDENCIA_ADOPCION; SIN_EVIDENCIA_PARTICIPACION. Los valores de señales son diagnósticos derivados de indicadores; no deben interpretarse como conteos de participantes o demanda comprobada.

## 12.4 GET /tendencias/electromovilidad — validado con sesión gubernamental

La primera prueba respondió {"detail":"Sesión gubernamental requerida"}, lo que verificó el control de acceso. Posteriormente el equipo ejecutó el mismo GET con una cookie gubernamental vigente y recibió una respuesta exitosa: {"series":\[{"clave_metrica":"VENTAS_EV","zona_clave":"09","fuente":"INEGI_RAIAVL_EV","puntos":\[...20 observaciones mensuales...\]}\],"disponible":true}. Se confirma que la autenticación mediante cookie funciona para este endpoint. No se infiere que se hayan probado otros roles.

## 12.5 GET /panorama — potencia confirmada

La respuesta observada en esta auditoría incluye infraestructura.estaciones_registradas=381, conectores_registrados=1021, potencia_total_kw=31694.5, potencia_nominal_agregada_kw=31694.5 y estado_operativo_verificado=false. metodologia_potencia.formula="SUM(cantidad \* potencia_kw)"; la respuesta advierte expresamente que no equivale a potencia simultánea, no confirma operación y depende de la calidad de datos. Con ello se cierra la divergencia de versión del panorama que la sección 4 había dejado pendiente: los campos metodológicos SÍ están presentes en el backend local auditado.

## 12.6 Pendientes de validación

Persisten sin ejecución documentada los casos de error 401/403/404/422 de otras rutas, estaciones con filtros y detalle, operaciones completas de perfiles ciudadanos, consulta administrativa de solicitudes y pruebas de borrado. La autenticación gubernamental y la respuesta exitosa de tendencias SÍ quedaron verificadas en una segunda prueba aportada por el equipo. No se debe describir ninguno de los otros flujos como verificado en ejecución.

# 13. Validación posterior: tendencias de electromovilidad — 8 de octubre de 2026

Fuente de evidencia: salida de curl -sS -b cookies.txt http://127.0.0.1:8000/api/v1/tendencias/electromovilidad \| python -m json.tool, compartida por el equipo. Esta sección reemplaza la condición de pendiente de la primera auditoría para este endpoint; no modifica los restantes hallazgos.

## 13.1 Contrato confirmado mediante respuesta real

- Método y ruta: GET /api/v1/tendencias/electromovilidad.

- Autenticación: cookie de sesión gubernamental válida. Sin sesión, se observó HTTP con cuerpo {"detail":"Sesión gubernamental requerida"}; no se registró el código HTTP de esa prueba, por lo que no se le asigna uno aquí.

- Parámetros: no se enviaron parámetros de consulta ni cuerpo en la prueba. La ruta inspeccionada no define parámetros de entrada.

- Respuesta exitosa observada: objeto {series, disponible}; disponible=true; series es un arreglo con un elemento que contiene clave_metrica="VENTAS_EV", zona_clave="09", fuente="INEGI_RAIAVL_EV" y puntos como arreglo de objetos {periodo,valor,unidad,fuente}.

- Cobertura real: CDMX (clave 09), 20 periodos mensuales consecutivos desde 2025-01 hasta 2026-08; unidad="vehiculos"; fuente="INEGI_RAIAVL_EV" en todos los puntos.

- Interpretación: ventas mensuales registradas, no parque vehicular EV acumulado, inventario por alcaldía ni pronóstico. No imputar periodos ausentes con cero.

## 13.2 Serie completa observada

| Periodo | Vehículos | Periodo | Vehículos |
|---------|-----------|---------|-----------|
| 2025-01 | 561       | 2025-11 | 574       |
| 2025-02 | 485       | 2025-12 | 647       |
| 2025-03 | 722       | 2026-01 | 475       |
| 2025-04 | 820       | 2026-02 | 679       |
| 2025-05 | 716       | 2026-03 | 992       |
| 2025-06 | 751       | 2026-04 | 585       |
| 2025-07 | 534       | 2026-05 | 668       |
| 2025-08 | 1155      | 2026-06 | 629       |
| 2025-09 | 848       | 2026-07 | 1027      |
| 2025-10 | 758       | 2026-08 | 679       |

## 13.3 Ejemplo JSON verificado (fragmento fiel)

Fragmento de dos puntos extraídos de la respuesta real. La respuesta original contiene los 20 puntos documentados en la tabla; no se presenta este fragmento como el cuerpo íntegro.

{

"series": \[{

"clave_metrica": "VENTAS_EV",

"zona_clave": "09",

"fuente": "INEGI_RAIAVL_EV",

"puntos": \[

{"periodo":"2025-01","valor":561.0,"unidad":"vehiculos","fuente":"INEGI_RAIAVL_EV"},

{"periodo":"2026-08","valor":679.0,"unidad":"vehiculos","fuente":"INEGI_RAIAVL_EV"}

\]

}\],

"disponible": true

}

## 13.4 Estado de aceptación actualizado

VALIDADO EN EJECUCIÓN: lectura de tendencias con cookie gubernamental; forma de respuesta; fuente; clave territorial; unidad; 20 valores y periodos. PENDIENTE: verificar errores y roles alternativos, además de los flujos enumerados en la sección 12.6. La disponibilidad de esta serie permite integrar una gráfica histórica sin afirmar que represente adopción territorial o parque vehicular.
