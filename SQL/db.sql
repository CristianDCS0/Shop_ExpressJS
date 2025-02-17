# Redistributions of source code must retain the above copyright
# Database
CREATE DATABASE express_react;
USE express_react;

#Tables
CREATE TABLE posts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products(
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE address(
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    street_address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50)
);

CREATE TABLE users(
    id VARCHAR(40) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    birthdate DATE NOT NULL,
    gender varchar(15) NOT NULL,
    password VARCHAR(100) NOT NULL,
    address_id VARCHAR(50),
    role varchar(30) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE cart (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    id_user VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    id_cart VARCHAR(50) NOT NULL,
    id_product VARCHAR(50) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (id_cart) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id) ON DELETE CASCADE
);

-- add column stock to products --
ALTER TABLE products ADD stock INT NOT NULL;

-- delete column stock to products --
ALTER TABLE products DROP COLUMN stock;

