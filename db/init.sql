CREATE TABLE IF NOT EXISTS users (
  id varchar(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(60) NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@doe.com', '$2b$12$Jn6uUbTTmcChTCxEbFRZD.UzHv2dHlt8ImCriE0AxuRR9ik0H9fVu'),
('ad129cb0-2324-4d39-9027-1f793091e387', 'Jane Smith', 'jane@smith.com', '$2b$12$Jn6uUbTTmcChTCxEbFRZD.UzHv2dHlt8ImCriE0AxuRR9ik0H9fVu');

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) UNIQUE NOT NULL,
  price VARCHAR(60) NOT NULL,
  description VARCHAR(200) NOT NULL,
  material VARCHAR(100),
  size VARCHAR(100),
  color VARCHAR(100),
  category VARCHAR(100),
  other VARCHAR(200),
  image VARCHAR(100),
  owner_id VARCHAR(36) NOT NULL,
  -- FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (
  name, price, description, material, size, color, category, other, image, owner_id
) VALUES
(
  'Autumn Breeze Sweater',
  '49.90',
  'A warm hand-knitted wool sweater perfect for chilly autumn walks.',
  '100% Wool',
  'M (unisex)',
  'Burnt Orange',
  'Clothing > Sweaters',
  'Gentle wash recommended. Designed with love in Helsinki.',
  'paita.jpg',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Winter Comfort Blanket',
  '89.00',
  'Extra soft crocheted blanket to keep you warm through the Nordic winters.',
  'Acrylic blend',
  '150x200 cm',
  'Grey and white stripes',
  'Home > Blankets',
  'Ideal as a couch throw or a bed cover. One-of-a-kind pattern.',
  'peitto.jpg',
  'ad129cb0-2324-4d39-9027-1f793091e387'
),
(
  'Forest Beanie',
  '19.50',
  'Handmade beanie inspired by Finnish forest greens.',
  'Merino Wool',
  'One size fits most',
  'Moss Green',
  'Accessories > Beanies',
  'Stretchy ribbed design. Great for outdoor adventures.',
  'pipo.jpg',
  '550e8400-e29b-41d4-a716-446655440000'
);
