#!/usr/bin/with-contenv sh

cd /app

# Fix permissions for cache and log files
rm -rf var/cache/*
rm -rf var/logs/*
chmod -R 777 var/cache
chmod -R 777 var/logs

# Run migrations and warm Symfony cache
bin/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists
# bin/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists
# Run twice to fix weirdly.. TODO: TEST with v3
bin/console doctrine:migrations:migrate --ansi -e prod --no-interaction --allow-no-migration
bin/console cache:warm -e prod

chmod -R 777 var/cache
chmod -R 777 var/logs

# Start PHP-FPM
/usr/sbin/php-fpm7.0 -R --nodaemonize
