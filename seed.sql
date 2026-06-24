-- ============================================================
-- MANTIS — SEED DE PRODUCTOS DE EJEMPLO
-- Pegar completo en: Supabase Dashboard → SQL Editor → Run All
-- Idempotente: seguro ejecutar más de una vez
-- ============================================================

BEGIN;

-- ─── 1. CATEGORÍAS ───────────────────────────────────────────
INSERT INTO categorias (nombre, slug, orden, activa) VALUES
  ('Pulseras', 'pulseras', 1, true),
  ('Collares', 'collares', 2, true),
  ('Dijes',    'dijes',    3, true),
  ('Kits',     'kits',     4, true)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  orden  = EXCLUDED.orden,
  activa = EXCLUDED.activa;

-- ─── 2. PULSERAS ─────────────────────────────────────────────

INSERT INTO productos
  (categoria_id, nombre, slug, descripcion_corta, descripcion,
   precio, material, badge, activo, destacado, orden)
SELECT c.id, p.nombre, p.slug, p.descripcion_corta, p.descripcion,
       p.precio, p.material, p.badge, true, p.destacado, p.orden
FROM categorias c,
(VALUES
  ('Pulsera Charm Dorada',   'pulsera-charm-dorada',
   'Baño oro 18k · Dije incluido · Resistente al agua',
   'La más querida de nuestra colección. Cadena snake bañada en oro 18k con cierre langosta y dije intercambiable incluido. Perfecta sola o en conjunto.',
   18990, 'Baño oro 18k · Resistente al agua', 'Más vendido', true, 1),

  ('Pulsera Snake Fina',     'pulsera-snake-fina',
   'Cadena snake · Baño oro 18k · Cierre langosta',
   'Elegancia minimalista. Cadena snake ultra fina bañada en oro 18k con cierre langosta. Un básico que va con todo.',
   14990, 'Baño oro 18k · Cierre langosta', null, false, 2),

  ('Pulsera Eslabones',      'pulsera-eslabones',
   'Eslabones cuadrados · Baño oro 18k · Largo ajustable',
   'Tendencia statement. Eslabones bañados en oro 18k con extensión de 3 cm incluida. Presencia y elegancia en una sola pieza.',
   16990, 'Baño oro 18k · Extensión incluida', 'Nuevo', false, 3),

  ('Pulsera Perlas Doradas', 'pulsera-perlas-doradas',
   'Perlas cultivadas · Cierres dorados · Talla única',
   'Delicadeza natural. Perlas cultivadas de agua dulce con cierres bañados en oro 18k. Suave y sofisticada.',
   12990, 'Perlas cultivadas · Baño oro 18k', null, false, 4),

  ('Pulsera Corazón',        'pulsera-corazon',
   'Dije corazón 3D · Baño oro 18k · Cadena snake',
   'Un símbolo de amor propio. Cadena snake dorada con dije corazón 3D bañado en oro 18k. El regalo perfecto.',
   15990, 'Baño oro 18k · Corazón 3D', null, false, 5),

  ('Pulsera Trenzada',       'pulsera-trenzada',
   'Cadena trenzada · Baño oro 18k · Talla única',
   'Textura y carácter. Cadena trenzada de tres hilos bañada en oro 18k. Resistente, versátil y siempre elegante.',
   13990, 'Baño oro 18k · Tres hilos', null, false, 6)

) AS p(nombre, slug, descripcion_corta, descripcion,
       precio, material, badge, destacado, orden)
WHERE c.slug = 'pulseras'
ON CONFLICT (slug) DO UPDATE SET
  precio        = EXCLUDED.precio,
  badge         = EXCLUDED.badge,
  destacado     = EXCLUDED.destacado,
  descripcion_corta = EXCLUDED.descripcion_corta;

-- ─── 3. COLLARES ─────────────────────────────────────────────

INSERT INTO productos
  (categoria_id, nombre, slug, descripcion_corta, descripcion,
   precio, material, badge, activo, destacado, orden)
SELECT c.id, p.nombre, p.slug, p.descripcion_corta, p.descripcion,
       p.precio, p.material, p.badge, true, p.destacado, p.orden
FROM categorias c,
(VALUES
  ('Collar Medallón San Benito', 'collar-medallon-san-benito',
   'Medallón San Benito · Baño oro 18k · Cadena 40 cm',
   'Protección y estilo en una sola pieza. Medallón San Benito con detalle grabado sobre cadena fina bañada en oro 18k.',
   16990, 'Baño oro 18k · Medallón grabado', 'Más vendido', true, 1),

  ('Collar Gargantilla Fina',    'collar-gargantilla-fina',
   'Gargantilla · Baño oro 18k · Largo 38 cm',
   'El choker dorado perfecto. Gargantilla ultra fina bañada en oro 18k que abraza el cuello con elegancia.',
   13990, 'Baño oro 18k · Cierre langosta', null, false, 2),

  ('Collar Perlas Barrocas',     'collar-perlas-barrocas',
   'Perlas barrocas · Cierres dorados · Largo 42 cm',
   'Lujo natural. Perlas barrocas de forma irregular con cierres bañados en oro 18k. Único e irrepetible.',
   19990, 'Perlas barrocas · Baño oro 18k', 'Exclusivo', false, 3),

  ('Collar Estrella Norte',      'collar-estrella-norte',
   'Dije estrella · Baño oro 18k · Cadena 40 cm',
   'Guiada por las estrellas. Dije estrella de cinco puntas calada sobre cadena snake bañada en oro 18k.',
   14990, 'Baño oro 18k · Estrella calada', null, false, 4),

  ('Collar Infinito',            'collar-infinito',
   'Símbolo infinito · Baño oro 18k · Cadena 40 cm',
   'Lo que dura para siempre. Símbolo infinito delicado sobre cadena fina bañada en oro 18k.',
   12990, 'Baño oro 18k · Símbolo infinito', null, false, 5),

  ('Collar Corazón Cristal',     'collar-corazon-cristal',
   'Corazón con cristal · Baño oro 18k · Cadena 40 cm',
   'Luminosidad y amor. Colgante corazón con cristal central facetado sobre cadena snake bañada en oro 18k.',
   17990, 'Baño oro 18k · Cristal facetado', null, false, 6)

) AS p(nombre, slug, descripcion_corta, descripcion,
       precio, material, badge, destacado, orden)
WHERE c.slug = 'collares'
ON CONFLICT (slug) DO UPDATE SET
  precio        = EXCLUDED.precio,
  badge         = EXCLUDED.badge,
  destacado     = EXCLUDED.destacado,
  descripcion_corta = EXCLUDED.descripcion_corta;

-- ─── 4. DIJES ────────────────────────────────────────────────

INSERT INTO productos
  (categoria_id, nombre, slug, descripcion_corta, descripcion,
   precio, material, badge, activo, destacado, orden)
SELECT c.id, p.nombre, p.slug, p.descripcion_corta, p.descripcion,
       p.precio, p.material, null, true, false, p.orden
FROM categorias c,
(VALUES
  ('Dije Corazón Rojo',     'dije-corazon-rojo',
   'Esmalte rojo · Baño oro 18k · Compatible con todas las pulseras',
   'Amor propio en miniatura. Dije corazón esmaltado en rojo intenso. Compatible con nuestras pulseras y collares.',
   4990, 'Baño oro 18k · Esmalte rojo', 1),

  ('Dije Estrella Dorada',  'dije-estrella-dorada',
   'Estrella 5 puntas · Baño oro 18k · Compatible con todas las pulseras',
   'Brilla siempre. Dije estrella de cinco puntas calada, bañada en oro 18k. Ligera y delicada.',
   4990, 'Baño oro 18k · Estrella calada', 2),

  ('Dije 11:11',            'dije-1111',
   'Números 11:11 · Baño oro 18k · Pide un deseo',
   'Atrapa el momento. Dije con los números 11:11 grabados en relieve. Para quienes creen en la magia de los instantes.',
   5990, 'Baño oro 18k · Grabado en relieve', 3),

  ('Dije Mariposa Azul',    'dije-mariposa-azul',
   'Esmalte azul · Baño oro 18k · Símbolo de transformación',
   'Libertad y cambio. Dije mariposa con esmalte azul celeste sobre base dorada. Símbolo de nueva etapa.',
   5990, 'Baño oro 18k · Esmalte azul celeste', 4),

  ('Dije Corazón Outline',  'dije-corazon-outline',
   'Corazón calado · Baño oro 18k · Delicado y minimalista',
   'Minimalismo con amor. Dije corazón calado sin relleno, bañado en oro 18k. Sutileza y elegancia en cada detalle.',
   4990, 'Baño oro 18k · Calado', 5),

  ('Dije Candado Dorado',   'dije-candado-dorado',
   'Candado con cerradura · Baño oro 18k · Símbolo de protección',
   'Protege lo que amas. Dije candado con cerradura grabada en detalle, bañado en oro 18k.',
   4990, 'Baño oro 18k · Grabado', 6)

) AS p(nombre, slug, descripcion_corta, descripcion,
       precio, material, orden)
WHERE c.slug = 'dijes'
ON CONFLICT (slug) DO UPDATE SET
  precio            = EXCLUDED.precio,
  descripcion_corta = EXCLUDED.descripcion_corta;

-- ─── 5. VARIANTES — PULSERAS ─────────────────────────────────
-- Borra y recrea para evitar duplicados si se corre más de una vez

DELETE FROM variantes
WHERE producto_id IN (
  SELECT id FROM productos
  WHERE slug IN (
    'pulsera-charm-dorada', 'pulsera-snake-fina', 'pulsera-eslabones',
    'pulsera-perlas-doradas', 'pulsera-corazon', 'pulsera-trenzada'
  )
);

INSERT INTO variantes (producto_id, nombre, sku, stock, activa)
SELECT p.id, v.nombre, v.sku, v.stock, true
FROM (VALUES
  -- Pulsera Charm Dorada (24 total: 6+6+6+6)
  ('pulsera-charm-dorada',   'S — 16 cm',   'PUL-CHARM-S',   6),
  ('pulsera-charm-dorada',   'M — 17 cm',   'PUL-CHARM-M',   6),
  ('pulsera-charm-dorada',   'L — 18 cm',   'PUL-CHARM-L',   6),
  ('pulsera-charm-dorada',   'XL — 19 cm',  'PUL-CHARM-XL',  6),
  -- Pulsera Snake Fina (8 total: 2+2+2+2)
  ('pulsera-snake-fina',     'S — 16 cm',   'PUL-SNAKE-S',   2),
  ('pulsera-snake-fina',     'M — 17 cm',   'PUL-SNAKE-M',   2),
  ('pulsera-snake-fina',     'L — 18 cm',   'PUL-SNAKE-L',   2),
  ('pulsera-snake-fina',     'XL — 19 cm',  'PUL-SNAKE-XL',  2),
  -- Pulsera Eslabones (agotado: 0+0+0+0)
  ('pulsera-eslabones',      'S — 16 cm',   'PUL-ESLA-S',    0),
  ('pulsera-eslabones',      'M — 17 cm',   'PUL-ESLA-M',    0),
  ('pulsera-eslabones',      'L — 18 cm',   'PUL-ESLA-L',    0),
  ('pulsera-eslabones',      'XL — 19 cm',  'PUL-ESLA-XL',   0),
  -- Pulsera Perlas Doradas (talla única: 15)
  ('pulsera-perlas-doradas', 'Única',        'PUL-PERLA-U',  15),
  -- Pulsera Corazón (6 total: 2+2+1+1)
  ('pulsera-corazon',        'S — 16 cm',   'PUL-CORA-S',    2),
  ('pulsera-corazon',        'M — 17 cm',   'PUL-CORA-M',    2),
  ('pulsera-corazon',        'L — 18 cm',   'PUL-CORA-L',    1),
  ('pulsera-corazon',        'XL — 19 cm',  'PUL-CORA-XL',   1),
  -- Pulsera Trenzada (talla única: 20)
  ('pulsera-trenzada',       'Única',        'PUL-TREN-U',   20)

) AS v(prod_slug, nombre, sku, stock)
JOIN productos p ON p.slug = v.prod_slug;

-- ─── 6. VARIANTES — COLLARES ─────────────────────────────────

DELETE FROM variantes
WHERE producto_id IN (
  SELECT id FROM productos
  WHERE slug IN (
    'collar-medallon-san-benito', 'collar-gargantilla-fina',
    'collar-perlas-barrocas',     'collar-estrella-norte',
    'collar-infinito',            'collar-corazon-cristal'
  )
);

INSERT INTO variantes (producto_id, nombre, sku, stock, activa)
SELECT p.id, v.nombre, v.sku, v.stock, true
FROM (VALUES
  ('collar-medallon-san-benito', 'Largo estándar — 40 cm', 'COL-BENI-U',  15),
  ('collar-gargantilla-fina',    'Largo estándar — 38 cm', 'COL-GARG-U',  10),
  ('collar-perlas-barrocas',     'Largo estándar — 42 cm', 'COL-PERL-U',   6),
  ('collar-estrella-norte',      'Largo estándar — 40 cm', 'COL-ESTR-U',   0),
  ('collar-infinito',            'Largo estándar — 40 cm', 'COL-INFI-U',   8),
  ('collar-corazon-cristal',     'Largo estándar — 40 cm', 'COL-CRIS-U',  12)

) AS v(prod_slug, nombre, sku, stock)
JOIN productos p ON p.slug = v.prod_slug;

-- ─── 7. VARIANTES — DIJES ────────────────────────────────────

DELETE FROM variantes
WHERE producto_id IN (
  SELECT id FROM productos
  WHERE slug IN (
    'dije-corazon-rojo', 'dije-estrella-dorada', 'dije-1111',
    'dije-mariposa-azul', 'dije-corazon-outline', 'dije-candado-dorado'
  )
);

INSERT INTO variantes (producto_id, nombre, sku, stock, activa)
SELECT p.id, 'Única', v.sku, v.stock, true
FROM (VALUES
  ('dije-corazon-rojo',     'DIJ-CORA-R',  20),
  ('dije-estrella-dorada',  'DIJ-ESTR-D',  18),
  ('dije-1111',             'DIJ-1111-U',  15),
  ('dije-mariposa-azul',    'DIJ-MARI-A',  12),
  ('dije-corazon-outline',  'DIJ-CORA-O',  20),
  ('dije-candado-dorado',   'DIJ-CAND-D',  16)

) AS v(prod_slug, sku, stock)
JOIN productos p ON p.slug = v.prod_slug;

-- ─── 8. CUPÓN DE EJEMPLO ─────────────────────────────────────
INSERT INTO cupones (codigo, tipo, valor, minimo_compra, usos_maximos, activo)
VALUES ('MANTIS10', 'porcentaje', 10, 15000, null, true)
ON CONFLICT (codigo) DO NOTHING;

COMMIT;

-- ─── Verificación ─────────────────────────────────────────────
SELECT
  c.slug AS categoria,
  COUNT(p.id) AS productos,
  SUM(v_count.variantes) AS variantes_total
FROM categorias c
LEFT JOIN productos p ON p.categoria_id = c.id AND p.activo = true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS variantes FROM variantes WHERE producto_id = p.id
) v_count ON true
GROUP BY c.slug, c.orden
ORDER BY c.orden;
