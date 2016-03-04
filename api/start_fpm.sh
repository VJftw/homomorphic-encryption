#!/usr/bin/with-contenv sh

cd /app

./setup.sh

chmod -R 777 var/cache
chmod -R 777 var/logs

# Start PHP-FPM
/usr/sbin/php-fpm7.0 -R --nodaemonize
