
CREATE DATABASE IF NOT EXISTS grocery_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE grocery_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens (one active token per user)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_email)
);

-- Items catalog
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  tag VARCHAR(100) DEFAULT ''
);

-- Cart items per user
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_item (user_email, item_id),
  INDEX (user_email),
  INDEX (item_id)
);

-- Sample items (from previous static data)
REPLACE INTO items (id, name, price, unit, description, tag) VALUES
('apple', 'Crisp Apples', 2.99, '1 lb', 'Bright, sweet, and perfect for snacks or pies.', 'Fresh'),
('milk', 'Whole Milk', 3.49, '1 gal', 'Rich and creamy dairy for every day.', 'Dairy'),
('bread', 'Rustic Bread', 4.25, '1 loaf', 'Baked daily with a soft center and crisp crust.', 'Bakery'),
('eggs', 'Farm Eggs', 3.15, '12 pack', 'Golden yolks from local farms.', 'Protein'),
('greens', 'Baby Greens', 2.75, '8 oz', 'Washed and ready for quick salads.', 'Produce'),
('coffee', 'House Coffee', 8.95, '12 oz', 'Smooth roast with notes of cocoa and caramel.', 'Pantry');
