-- ========================================
-- Specora FYP - Database User Setup Script
-- ========================================
-- Run this script as postgres superuser
-- 
-- Usage:
--   psql -U postgres -f create-specora-user.sql
--

-- 1. Create dedicated user for Specora
DROP USER IF EXISTS specora;
CREATE USER specora WITH 
    PASSWORD 'specora_dev_2025'
    LOGIN
    CREATEDB;

-- 2. Create database
DROP DATABASE IF EXISTS specora;
CREATE DATABASE specora 
    OWNER specora
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE specora TO specora;

-- 4. Connect to the new database
\c specora

-- 5. Grant schema privileges
GRANT ALL ON SCHEMA public TO specora;
GRANT ALL ON ALL TABLES IN SCHEMA public TO specora;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO specora;

-- 6. Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON TABLES TO specora;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON SEQUENCES TO specora;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON FUNCTIONS TO specora;

-- 7. Verification
\du specora
\l specora
\conninfo

-- Success message
SELECT 'User "specora" created successfully!' AS status,
       'Password: specora_dev_2025' AS credentials,
       'Database: specora' AS database,
       'Ready to use!' AS next_step;
