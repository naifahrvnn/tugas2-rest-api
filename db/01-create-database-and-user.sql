USE master;
GO

-- 1) Database aplikasi.
IF DB_ID('review_kantin') IS NULL
BEGIN
    CREATE DATABASE review_kantin;
END
GO

-- 2) Login aplikasi (SQL Authentication).
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'naifa')
BEGIN
    CREATE LOGIN naifa
        WITH PASSWORD = N'<GANTI_PASSWORD>',
             DEFAULT_DATABASE = review_kantin;
END
GO

-- 3) User di dalam database + hak akses baca/tulis.
USE review_kantin;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'naifa')
BEGIN
    CREATE USER naifa FOR LOGIN naifa;
END
GO

ALTER ROLE db_datareader ADD MEMBER naifa;
ALTER ROLE db_datawriter ADD MEMBER naifa;
GO

-- 4) Verifikasi.
SELECT name, type_desc, authentication_type_desc
FROM sys.database_principals
WHERE name = 'naifa';
GO
