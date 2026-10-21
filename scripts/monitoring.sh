#!/bin/bash
# Simple monitoring script for VolleyStack

echo "=== System Monitoring ==="
date

echo -e "\n--- Disk Usage ---"
df -h / | awk 'NR==2 {print "Disk Space: " $3 " used out of " $2 " (" $5 ")"}'

echo -e "\n--- Memory Usage ---"
free -m | awk 'NR==2 {print "Memory: " $3 "MB used out of " $2 "MB (" printf("%.2f%%", $3*100/$2) ")"}'

echo -e "\n--- Docker Containers Status ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Alerts
DISK_USE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USE" -gt 85 ]; then
    echo "WARNING: Disk usage is over 85%!"
fi

echo "========================="
