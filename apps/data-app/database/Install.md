
# InstallSQL.md
## Microsoft SQL Server on macOS (Docker)

### 1. Install Docker Desktop
Download and install Docker Desktop for Mac from:
https://www.docker.com/products/docker-desktop

Verify:
```bash
docker --version
docker compose version
```

### 2. Run SQL Server 2022 in Docker
```bash
docker run --platform linux/amd64 \
  -e ACCEPT_EULA=Y \
  -e MSSQL_SA_PASSWORD='MyN3wP@ssw0rd123!' \
  -p 1433:1433 \
  --name sqldb-cpq-laundry-dev \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### 3. Verify container
```bash
docker ps
```

### 4. Connection Info
```text
Server=localhost,1433;
User ID=sa;
Password=MyN3wP@ssw0rd123!;
Encrypt=False;
TrustServerCertificate=True;
```

### 5. Stop / Start
```bash
docker stop sqldb-cpq-laundry-dev
docker start sqldb-cpq-laundry-dev
```

### 6. Remove (reset)
```bash
docker rm -f sqldb-cpq-laundry-dev
```

### 7. Optional GUI
Install Azure Data Studio:
https://learn.microsoft.com/sql/azure-data-studio

Connect using:
localhost,1433 / sa / MyN3wP@ssw0rd123!



# 🗄️ Install.md

## UniFirst CPQ -- Azure SQL Backup, Restore & Local Dev Environment

This guide defines the **official database workflow** for the UniFirst
CPQ Laundry platform.

## Azure SQL

Server: sql-cpq-laundry-proto-eastus2.database.windows.net\
Database: sqldb-cpq-laundry-dev

## Entra Connection

Server=tcp:sql-cpq-laundry-proto-eastus2.database.windows.net,1433;
Initial Catalog=sqldb-cpq-laundry-dev; Encrypt=True;
Authentication="Active Directory Default";

## SQL Auth

Server=tcp:sql-cpq-laundry-proto-eastus2.database.windows.net,1433;
Initial Catalog=sqldb-cpq-laundry-dev; User ID=Mysa;
Password={your_password};

## Export Local to BACPAC

./sqlpackage /Action:Export
/SourceConnectionString:"Server=localhost,1433;Database=sqldb-cpq-laundry-dev;User
ID=sa;Password=MyN3wP@ssw0rd123!;Encrypt=False;TrustServerCertificate=True;"
/TargetFile:"\$HOME/Downloads/mydb.bacpac"

## Import to Azure

./sqlpackage /Action:Import /SourceFile:"\$HOME/Downloads/mydb.bacpac"
/TargetConnectionString:"Server=tcp:sql-cpq-laundry-proto-eastus2.database.windows.net,1433;Database=sqldb-cpq-laundry-dev;User
ID=Mysa;Password=MyN3wP@ssw0rd123!;Encrypt=True;TrustServerCertificate=False;"

## Docker SQL

docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='MyN3wP@ssw0rd123!' -p
1433:1433 --name sqldb-cpq-laundry-dev -d
mcr.microsoft.com/mssql/server:2022-latest
