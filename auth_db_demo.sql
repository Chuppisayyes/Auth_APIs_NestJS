CREATE DATABASE IF NOT EXISTS auth_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_demo;

-- TABLE: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar VARCHAR(500),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- TABLE: roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255)
);
-- TABLE: user_roles
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
-- TABLE: refresh_tokens
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token TEXT NOT NULL,
    user_agent VARCHAR(500),
    ip_address VARCHAR(50),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- TABLE: email_otps
CREATE TABLE email_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- TABLE: user_devices
CREATE TABLE user_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_name VARCHAR(255),
    user_agent VARCHAR(500),
    ip_address VARCHAR(50),
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- INSERT ROLES
INSERT INTO roles (name, description) VALUES
('admin', 'Full system administrator'),
('user', 'Normal system user'),
('staff', 'Internal employee');
-- INSERT DEMO USERS
INSERT INTO users (email, password, full_name, phone, avatar, is_email_verified)
VALUES
('admin@example.com', '$2a$10$RANDOMHASHADMIN', 'System Admin', '0909000001', NULL, 1),
('john.doe@example.com', '$2a$10$RANDOMHASHUSER', 'John Doe', '0909000002', NULL, 1),
('staff01@example.com', '$2a$10$RANDOMHASHSTAFF', 'Staff Member', '0909000003', NULL, 0);
-- ASSIGN ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin is ADMIN
(2, 2), -- john is USER
(3, 3);
-- staff01 is STAFF


-- INSERT REFRESH TOKENS
INSERT INTO refresh_tokens (user_id, refresh_token, user_agent, ip_address, expires_at)
VALUES
(1, 'admin-refresh-token-123', 'Chrome 120', '192.168.1.10', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(2, 'user-refresh-token-456', 'Firefox 116', '192.168.1.11', DATE_ADD(NOW(), INTERVAL 30 DAY));
-- INSERT EMAIL OTP DEMO

INSERT INTO email_otps (email, otp, expires_at, is_used)
VALUES
('staff01@example.com', '123456', DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0);
-- INSERT USER DEVICE LOGINS
INSERT INTO user_devices (user_id, device_name, user_agent, ip_address)
VALUES
(1, 'Laptop Admin', 'Chrome 120', '192.168.1.10'),
(2, 'iPhone 14', 'Safari Mobile', '192.168.1.50');