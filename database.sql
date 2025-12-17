CREATE DATABASE IF NOT EXISTS video_platform;
USE video_platform;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- In production, store hashed passwords!
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default admin user if not exists (password: admin123)
-- INSERT IGNORE INTO users (username, password, name, role) VALUES ('admin', 'admin123', '管理員', 'admin');

