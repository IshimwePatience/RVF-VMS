Write-Host "Starting local database container..."
docker compose up -d db

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 5

Write-Host "Downloading database dump from Supabase..."
# We use docker run to get pg_dump so we don't need it installed locally
docker run --rm -v "$($PWD):/workspace" -e PGPASSWORD="Gashugi123@" postgres:17-alpine sh -c "pg_dump -h aws-0-eu-west-1.pooler.supabase.com -U postgres.twqeninkntadpjtelisj -p 5432 -d postgres --clean --if-exists --no-owner --no-acl > /workspace/dump.sql"

Write-Host "Copying dump.sql to the local db container..."
$dbContainer = (docker compose ps -q db).Trim()
if ([string]::IsNullOrWhiteSpace($dbContainer)) {
    Write-Host "Could not find db container. Make sure docker is running."
    exit 1
}
docker cp dump.sql "$($dbContainer):/tmp/dump.sql"

Write-Host "Restoring database locally..."
docker compose exec -T db psql -U postgres -d postgres -f /tmp/dump.sql

Write-Host "Migration completed successfully!"
