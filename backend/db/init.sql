CREATE TABLE sucursales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE modulos (
  id SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  sucursal_id INT NOT NULL REFERENCES sucursales(id),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (numero, sucursal_id)
);

CREATE TABLE turnos (
  id SERIAL PRIMARY KEY,
  numero TEXT NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'espera' CHECK (estado IN ('espera','atendiendo','finalizado')),
  modulo INT,
  sucursal_id INT NOT NULL REFERENCES sucursales(id),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO sucursales (nombre, latitude, longitude) VALUES
 ('Concón', -32.9230, -71.5190), ('Viña del Mar', -33.0245, -71.5518),
 ('Valparaíso', -33.0472, -71.6127), ('Quilpué', -33.0479, -71.4425),
 ('Villa Alemana', -33.0422, -71.3733);

 INSERT INTO modulos (numero, sucursal_id)
 SELECT numero, sucursal.id
 FROM sucursales AS sucursal
 CROSS JOIN generate_series(1, 5) AS numero
 ON CONFLICT (numero, sucursal_id) DO NOTHING;