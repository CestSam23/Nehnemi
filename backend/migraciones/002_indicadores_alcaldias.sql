BEGIN;

-- ============================================================
-- NEHNEMI
-- Indicadores agregados por alcaldía
--
-- Metodología:
-- Promedio aritmético de las puntuaciones disponibles
-- de las AGEB pertenecientes a cada alcaldía.
--
-- Dimensiones:
-- INFRAESTRUCTURA y ACCESIBILIDAD
--
-- Los resultados son indicadores territoriales derivados,
-- no mediciones directas a escala alcaldía.
-- ============================================================

WITH indicadores_ageb AS (
    SELECT
        a.id AS alcaldia_id,
        a.nombre AS alcaldia,
        z.id AS ageb_id,
        i.dimension,
        i.puntuacion
    FROM zonas z
    JOIN zonas a
        ON a.id = z.zona_padre_id
    JOIN indicadores_actuales i
        ON i.zona_id = z.id
    WHERE z.tipo = 'AGEB'
      AND a.tipo = 'ALCALDIA'
      AND i.dimension IN (
          'INFRAESTRUCTURA',
          'ACCESIBILIDAD'
      )
),

agregados AS (
    SELECT
        alcaldia_id,
        alcaldia,
        dimension,
        ROUND(AVG(puntuacion)::numeric, 2) AS puntuacion,
        COUNT(*)::integer AS ageb_evaluadas,
        MIN(puntuacion) AS puntuacion_minima,
        MAX(puntuacion) AS puntuacion_maxima
    FROM indicadores_ageb
    GROUP BY
        alcaldia_id,
        alcaldia,
        dimension
),

clasificados AS (
    SELECT
        *,
        CASE
            WHEN puntuacion >= 75 THEN 'ALTA'
            WHEN puntuacion >= 50 THEN 'MEDIA'
            WHEN puntuacion >= 25 THEN 'BAJA'
            ELSE 'MUY_BAJA'
        END AS nivel_calculado
    FROM agregados
)

INSERT INTO evaluaciones_indicadores (
    zona_id,
    dimension,
    puntuacion,
    nivel,
    confianza,
    tamano_muestra,
    version_formula,
    componentes,
    explicacion
)

SELECT
    c.alcaldia_id,
    c.dimension,
    c.puntuacion,

    c.nivel_calculado::nivel_indicador,

    'MEDIA'::nivel_confianza,

    c.ageb_evaluadas,

    'AGREGACION_ALCALDIA_V1',

    jsonb_build_object(
        'metodo', 'PROMEDIO_ARITMETICO_AGEB',
        'ageb_evaluadas', c.ageb_evaluadas,
        'puntuacion_minima', c.puntuacion_minima,
        'puntuacion_maxima', c.puntuacion_maxima,
        'origen', 'INDICADORES_AGEB'
    ),

    'Promedio territorial de las puntuaciones de AGEB evaluadas pertenecientes a la alcaldía. No representa una medición directa a escala alcaldía.'

FROM clasificados c

-- Evitar duplicados al volver a ejecutar la migración.
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluaciones_indicadores e
    WHERE e.zona_id = c.alcaldia_id
      AND e.dimension = c.dimension
      AND e.version_formula = 'AGREGACION_ALCALDIA_V1'
);

COMMIT;
