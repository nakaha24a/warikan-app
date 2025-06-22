-- SQL Server Management Studio (SSMS) で実行することを想定したSQLスクリプト

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'testDB')
BEGIN
    CREATE DATABASE testDB;
    PRINT 'Database testDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database testDB already exists.';
END
GO


USE testDB;
GO

-- 既存テーブルの削除（
IF OBJECT_ID('dbo.nameTest', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.nameTest;
    PRINT 'Table nameTest dropped.';
END
GO

-- nameTest テーブルの作成
CREATE TABLE nameTest (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT GETDATE()
);
GO

PRINT 'Table nameTest for testDB created successfully.';

PRINT 'All SQL database objects defined in this script have been processed.';
