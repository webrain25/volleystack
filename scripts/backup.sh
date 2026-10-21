#!/bin/bash
# Backup script for VolleyStack PostgreSQL Database
# Run this script via cron on the EC2 instance, e.g., daily at 3 AM:
# 0 3 * * * /home/ubuntu/VolleyStack/scripts/backup.sh >> /home/ubuntu/backup.log 2>&1

# Configuration
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER_NAME="volleystack-db-1"
DB_USER="postgres"
DB_NAME="volleystack"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# File name
BACKUP_FILE="$BACKUP_DIR/volleystack_db_$TIMESTAMP.sql.gz"

echo "Starting backup at $TIMESTAMP..."

# Execute pg_dump inside the postgres container and gzip the output
docker exec -t $DB_CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -c | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
  
  # Optional: Delete backups older than 7 days
  find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;
  echo "Cleaned up old backups."
else
  echo "Backup failed!"
  # TODO: add webhook/email alert here
  exit 1
fi
