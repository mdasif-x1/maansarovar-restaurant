-- Database initialization script for MySQL Container
CREATE DATABASE IF NOT EXISTS maansarovar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maansarovar_db;

-- Source the initial schema
source /docker-entrypoint-initdb.d/V1__init_schema.sql;
