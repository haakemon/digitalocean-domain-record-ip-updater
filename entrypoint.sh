#!/bin/bash

declare -p | grep -Ev 'BASHOPTS|BASH_VERSINFO|EUID|PPID|SHELLOPTS|UID' > /container.env


echo "SHELL=/bin/bash
BASH_ENV=/container.env
* * * * * /usr/local/bin/node /app/dist/index.js >> /var/log/cron.log 2>&1
" > domain_record_cron

crontab domain_record_cron
service cron start
trap "service cron stop; exit" SIGINT SIGTERM

tail -f /var/log/cron.log
