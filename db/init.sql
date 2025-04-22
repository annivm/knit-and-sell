CREATE TABLE IF NOT EXISTS users (
  id varchar(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(60) NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password_hash) VALUES
('1', 'John Doe', 'john@doe.com', '12345567890');

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) UNIQUE NOT NULL,
  price VARCHAR(60) NOT NULL,
  description VARCHAR(200) NOT NULL,
  image VARCHAR(100),
  owner_id VARCHAR(36) NOT NULL,
  -- FOREIGN KEY (owner_id) REFERENCES users(id),
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, price, description, image, owner_id) VALUES
('Item 1', '10.00', 'Description for item 1', 'paita.jpg', '1')